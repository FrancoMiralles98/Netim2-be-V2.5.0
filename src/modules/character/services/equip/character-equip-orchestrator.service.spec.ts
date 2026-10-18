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
    let repository: { getCharacterById: jest.Mock; updateCharacterById: jest.Mock };
    let equipment: Record<string, jest.Mock>;
    let service: CharacterEquipOrchestratorService;
    let resultCharacter: typeof GENERAL_CHARACTER;

    beforeEach(() => {
        resultCharacter = structuredClone(GENERAL_CHARACTER);
        resultCharacter.equipo_1 = [{ id: 'instance', sub_type_equip: 'arma' } as unknown as EquipType];
        const changes = { character: resultCharacter, newItems: [], updatedItems: [{ id: 'instance' }] };
        repository = { getCharacterById: jest.fn().mockResolvedValue({
            ...structuredClone(GENERAL_CHARACTER), user_owner: 'owner',
        } as unknown as CharacterDocument), updateCharacterById: jest.fn().mockResolvedValue(undefined) };
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
        expect(repository.updateCharacterById).not.toHaveBeenCalled();
    });

    it.each([1, 2, 3] as const)('persists only changed equipment fields together for set %i', async slot => {
        const key = `equipo_${slot}` as 'equipo_1' | 'equipo_2' | 'equipo_3';
        const document = { ...structuredClone(GENERAL_CHARACTER), user_owner: 'owner' };
        document.equipo_selected = slot;
        document.inventario = [{ ...resultCharacter.equipo_1[0], id: 'instance', position: { row: 0, col: 0 } }];
        repository.getCharacterById.mockResolvedValue(document);
        resultCharacter[key] = resultCharacter.equipo_1;
        if (slot !== 1) resultCharacter.equipo_1 = [];
        resultCharacter.equipo_selected = slot;
        resultCharacter.stats.general.hp.max += 20;
        resultCharacter.atributos.STR.bonusPoints = 5;
        resultCharacter.type_weapon = 'espada';
        await service.equipItem('character', 'owner', 'instance');
        expect(repository.updateCharacterById).toHaveBeenCalledTimes(1);
        expect(repository.updateCharacterById).toHaveBeenCalledWith('character', {
            inventario: [], [key]: resultCharacter[key], stats: resultCharacter.stats,
            atributos: resultCharacter.atributos, type_weapon: 'espada',
        });
    });

    it('persists inventory and equipment together when unequipping', async () => {
        const document = { ...structuredClone(resultCharacter), user_owner: 'owner' };
        repository.getCharacterById.mockResolvedValue(document);
        resultCharacter.inventario = [{ ...resultCharacter.equipo_1[0], id: 'instance', position: { row: 0, col: 0 } }];
        resultCharacter.equipo_1 = [];
        await service.unequipItem('character', 'owner', 'arma');
        expect(repository.updateCharacterById).toHaveBeenCalledWith('character', {
            inventario: resultCharacter.inventario, equipo_1: [],
        });
    });

    it('persists the selected slot and changed derived stats without rewriting equipment', async () => {
        resultCharacter.equipo_1 = [];
        resultCharacter.equipo_selected = 2;
        resultCharacter.stats.general.hp.max += 10;
        await service.selectEquipment('character', 'owner', 2);
        expect(repository.updateCharacterById).toHaveBeenCalledWith('character', {
            equipo_selected: 2, stats: resultCharacter.stats,
        });
    });

    it('skips persistence when no equipment fields changed', async () => {
        resultCharacter.equipo_1 = [];
        await service.selectEquipment('character', 'owner', 1);
        expect(repository.updateCharacterById).not.toHaveBeenCalled();
    });

    it.each(actions)('does not persist when %s fails', async (method, argument) => {
        const failure = new Error('Operation failed');
        equipment[method].mockImplementation(() => { throw failure; });
        const handler = service[method] as (id: string, account: string, arg: unknown) => Promise<unknown>;
        await expect(handler.call(service, 'character', 'owner', argument)).rejects.toBe(failure);
        expect(repository.updateCharacterById).not.toHaveBeenCalled();
    });

    it('does not persist an invalid equip result', async () => {
        resultCharacter.equipo_1 = [];
        await expect(service.equipItem('character', 'owner', 'instance')).rejects.toThrow('No se encuentra la instancia equipada');
        expect(repository.updateCharacterById).not.toHaveBeenCalled();
    });

    it('propagates persistence failures instead of returning success', async () => {
        const failure = new Error('Database unavailable');
        repository.updateCharacterById.mockRejectedValue(failure);
        await expect(service.equipItem('character', 'owner', 'instance')).rejects.toBe(failure);
    });

    it('does not load before a purchase: ownership is checked inside the purchase transaction', async () => {
        expect(await service.buyEquipmentSlot('character', 'owner', 2)).toEqual({ slot: 2, currency: 'yang', yang: 200_000 });
        expect(repository.getCharacterById).not.toHaveBeenCalled();
        expect(equipment.buyEquipmentSlot).toHaveBeenCalledWith('character', 'owner', 2);
        expect(repository.updateCharacterById).not.toHaveBeenCalled();
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
