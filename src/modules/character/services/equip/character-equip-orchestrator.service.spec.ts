import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CharacterDocument } from '../../schema/character.schema';
import { CharacterRepository } from '../../repository/character-repository';
import { CharacterMapper } from '../../mapper/character-mapper';
import { GENERAL_CHARACTER } from '../../const/general-character.const';
import { CharacterEquipService } from './character-equip.service';
import { CharacterEquipOrchestratorService } from './character-equip-orchestrator.service';
import { EquipType } from 'netim2-shared';

describe('CharacterEquipOrchestratorService ownership', () => {
    const actions = [
        ['equipItem', 'instance'], ['unequipItem', 'arma'], ['selectEquipment', 2],
    ] as const;
    const mapper = new CharacterMapper();
    let repository: { getCharacterById: jest.Mock };
    let equipment: Record<string, jest.Mock>;
    let service: CharacterEquipOrchestratorService;
    let resultCharacter: typeof GENERAL_CHARACTER;

    beforeEach(() => {
        resultCharacter = structuredClone(GENERAL_CHARACTER);
        resultCharacter.equipo_1 = [{ id: 'instance', sub_type_equip: 'arma' } as unknown as EquipType];
        const changes = { character: resultCharacter, newItems: [], updatedItems: [{ id: 'instance' }] };
        repository = { getCharacterById: jest.fn().mockResolvedValue({
            ...structuredClone(GENERAL_CHARACTER), user_owner: 'owner',
        } as unknown as CharacterDocument) };
        equipment = {
            equipItem: jest.fn().mockReturnValue(changes),
            unequipItem: jest.fn().mockReturnValue(changes),
            selectEquipment: jest.fn().mockReturnValue(changes),
            buyEquipmentSlot: jest.fn().mockResolvedValue({ character: resultCharacter, response: { slot: 2, currency: 'yang', yang: 200_000 } }),
        };
        service = new CharacterEquipOrchestratorService(
            equipment as unknown as CharacterEquipService,
            repository as unknown as CharacterRepository, mapper,
        );
    });

    it.each(actions)('loads once and reuses the owned character for %s', async (method, argument) => {
        const handler = service[method] as (id: string, account: string, arg: unknown) => Promise<unknown>;
        const response = await handler.call(service, 'character', 'owner', argument);
        const stats = { stats: resultCharacter.stats, attributes: resultCharacter.atributos, type_weapon: resultCharacter.type_weapon };
        const expected = method === 'equipItem'
            ? { ...stats, equipmentSlot: 1, newItems: [], equippedItem: resultCharacter.equipo_1[0] }
            : method === 'unequipItem'
                ? { ...stats, equipmentSlot: 1, newItems: [], unequippedSlot: 'arma' }
                : { ...stats, equipo_selected: 1 };
        expect(response).toEqual(expected);
        expect(response).not.toHaveProperty('character');
        expect(response).not.toHaveProperty('updatedItems');
        expect(repository.getCharacterById).toHaveBeenCalledTimes(1);
        expect(repository.getCharacterById).toHaveBeenCalledWith('character');
        const document = await repository.getCharacterById.mock.results[0].value;
        expect(equipment[method]).toHaveBeenCalledWith(mapper.fromDb(document), argument);
    });

    it.each(actions)('rejects foreign characters before %s', async (method, argument) => {
        const handler = service[method] as (id: string, account: string, arg: unknown) => Promise<unknown>;
        await expect(handler.call(service, 'character', 'other', argument)).rejects.toBeInstanceOf(ForbiddenException);
        expect(repository.getCharacterById).toHaveBeenCalledTimes(1);
        expect(equipment[method]).not.toHaveBeenCalled();
    });

    it('does not load before a purchase: ownership is checked inside the purchase transaction', async () => {
        expect(await service.buyEquipmentSlot('character', 'owner', 2)).toEqual({ slot: 2, currency: 'yang', yang: 200_000 });
        expect(repository.getCharacterById).not.toHaveBeenCalled();
        expect(equipment.buyEquipmentSlot).toHaveBeenCalledWith('character', 'owner', 2);
    });

    it('returns only the account MD balance from a purchase', async () => {
        equipment.buyEquipmentSlot.mockResolvedValue({ character: resultCharacter, response: { slot: 3, currency: 'md', md: 500 } });
        expect(await service.buyEquipmentSlot('character', 'owner', 3)).toEqual({ slot: 3, currency: 'md', md: 500 });
        expect(repository.getCharacterById).not.toHaveBeenCalled();
    });

    it('propagates missing characters without performing the action', async () => {
        repository.getCharacterById.mockRejectedValue(new NotFoundException());
        await expect(service.equipItem('missing', 'owner', 'instance')).rejects.toBeInstanceOf(NotFoundException);
        expect(equipment.equipItem).not.toHaveBeenCalled();
    });
});
