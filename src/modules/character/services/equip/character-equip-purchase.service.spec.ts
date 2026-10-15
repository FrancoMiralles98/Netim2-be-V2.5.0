import { ClientSession, Connection } from 'mongoose';
import { CharacterPersistence } from 'netim2-shared';
import { GENERAL_CHARACTER } from '../../const/general-character.const';
import { CharacterDocument } from '../../schema/character.schema';
import { CharacterMapper } from '../../mapper/character-mapper';
import { CharacterRepository } from '../../repository/character-repository';
import { CharacterEquipService } from './character-equip.service';
import { UserService } from '../../../user/user.service';
import { UserEntity } from '../../../user/entity/user-entity';
import { UserRole } from '../../../user/types/user-roles.enum';
import { Inventory } from '../../../inventory/entities/inventory.entity';
import { UpdateStatsService } from '../stats/update-stats.service';

describe('CharacterEquipService slot purchases', () => {
    let stored: CharacterPersistence;
    let md: number;
    let owner: string;
    let characterRepository: { getCharacterById: jest.Mock; updateCharacterById: jest.Mock };
    let userService: { getUserById: jest.Mock; updateUserDataById: jest.Mock };
    let transaction: { withTransaction: jest.Mock; endSession: jest.Mock };
    let connection: { startSession: jest.Mock };
    let service: CharacterEquipService;

    beforeEach(() => {
        stored = structuredClone(GENERAL_CHARACTER);
        owner = 'owner';
        stored.yang = 700_000;
        md = 1_000;
        transaction = {
            withTransaction: jest.fn(async (callback: () => Promise<unknown>) => {
                const before = structuredClone(stored);
                const previousMd = md;
                try { return await callback(); }
                catch (error) { stored = before; md = previousMd; throw error; }
            }),
            endSession: jest.fn().mockResolvedValue(undefined),
        };
        connection = { startSession: jest.fn().mockResolvedValue(transaction) };
        characterRepository = {
            getCharacterById: jest.fn(async () => ({ ...structuredClone(stored), user_owner: owner }) as unknown as CharacterDocument),
            updateCharacterById: jest.fn(async (_id, data, _session) => { stored = structuredClone(data); return stored; }),
        };
        userService = {
            getUserById: jest.fn(async () => new UserEntity({
                username: 'owner', email: 'owner@test.local', role: UserRole.USER, md, yang: 9_000_000,
                almacen: new Inventory([]), almacenItemShop: new Inventory([]),
            })),
            updateUserDataById: jest.fn(async (_id, data, _session) => { md = data.md; }),
        };
        service = new CharacterEquipService(new CharacterMapper(),
            characterRepository as unknown as CharacterRepository,
            userService as unknown as UserService, connection as unknown as Connection, {} as UpdateStatsService);
    });

    it('charges character yang for slot 2 and enables only that slot', async () => {
        const { character: result, response } = await service.buyEquipmentSlot('character', 'owner', 2);
        expect(result.yang).toBe(200_000);
        expect(response).toEqual({ slot: 2, currency: 'yang', yang: 200_000 });
        expect(result.equipo_options).toEqual({ equipo1_on: true, equipo2_on: true, equipo3_on: false });
        expect(result.equipo_selected).toBe(1);
        expect(md).toBe(1_000);
        expect(userService.getUserById).not.toHaveBeenCalled();
        expect(userService.updateUserDataById).not.toHaveBeenCalled();
        expect(characterRepository.getCharacterById).toHaveBeenCalledWith('character', transaction);
        expect(characterRepository.updateCharacterById).toHaveBeenCalledWith('character', result, transaction);
        expect(transaction.endSession).toHaveBeenCalledTimes(1);
    });

    it('charges account MD for slot 3 without spending character yang', async () => {
        stored.yang = 0;
        const { character: result, response } = await service.buyEquipmentSlot('character', 'owner', 3);
        expect(md).toBe(500);
        expect(response).toEqual({ slot: 3, currency: 'md', md: 500 });
        expect(result.yang).toBe(0);
        expect(result.equipo_options.equipo3_on).toBe(true);
        expect(result.equipo_options.equipo2_on).toBe(false);
        expect(userService.getUserById).toHaveBeenCalledWith('owner', transaction);
        expect(userService.updateUserDataById).toHaveBeenCalledWith('owner', { md: 500 }, transaction);
        expect(characterRepository.updateCharacterById).toHaveBeenCalledWith('character', result, transaction);
    });

    it.each([2, 3] as const)('accepts an exact balance for slot %i', async slot => {
        if (slot === 2) stored.yang = 500_000;
        else md = 500;
        const { character: result, response } = await service.buyEquipmentSlot('character', 'owner', slot);
        expect(slot === 2 ? result.yang : md).toBe(0);
    });

    it('rejects insufficient character yang even when the account has money', async () => {
        stored.yang = 499_999;
        await expect(service.buyEquipmentSlot('character', 'owner', 2)).rejects.toThrow('Yang insuficiente');
        expect(stored.yang).toBe(499_999);
        expect(stored.equipo_options.equipo2_on).toBe(false);
        expect(characterRepository.updateCharacterById).not.toHaveBeenCalled();
        expect(userService.getUserById).not.toHaveBeenCalled();
        expect(transaction.endSession).toHaveBeenCalledTimes(1);
    });

    it('rejects insufficient account MD without falling back to character yang', async () => {
        md = 499;
        await expect(service.buyEquipmentSlot('character', 'owner', 3)).rejects.toThrow('MD insuficiente');
        expect(md).toBe(499);
        expect(stored.equipo_options.equipo3_on).toBe(false);
        expect(characterRepository.updateCharacterById).not.toHaveBeenCalled();
        expect(userService.updateUserDataById).not.toHaveBeenCalled();
    });

    it.each([1, 2, 3] as const)('rejects an already unlocked slot %i without charging', async slot => {
        stored.equipo_options = { equipo1_on: true, equipo2_on: true, equipo3_on: true };
        const original = structuredClone(stored);
        await expect(service.buyEquipmentSlot('character', 'owner', slot)).rejects.toThrow('ya está desbloqueado');
        expect(stored).toEqual(original);
        expect(characterRepository.updateCharacterById).not.toHaveBeenCalled();
        expect(userService.getUserById).not.toHaveBeenCalled();
        expect(md).toBe(1_000);
    });

    it('does not charge twice if the same slot is purchased again', async () => {
        await service.buyEquipmentSlot('character', 'owner', 3);
        await expect(service.buyEquipmentSlot('character', 'owner', 3)).rejects.toThrow('ya está desbloqueado');
        expect(md).toBe(500);
        expect(userService.updateUserDataById).toHaveBeenCalledTimes(1);
        expect(characterRepository.updateCharacterById).toHaveBeenCalledTimes(1);
    });

    it('validates character ownership before consulting the paying account', async () => {
        owner = 'someone-else';
        await expect(service.buyEquipmentSlot('character', 'owner', 3)).rejects.toThrow('no pertenece');
        expect(userService.getUserById).not.toHaveBeenCalled();
        expect(characterRepository.updateCharacterById).not.toHaveBeenCalled();
    });

    it.each([0, 4, -1])('rejects invalid slot %i before opening a transaction', async slot => {
        await expect(service.buyEquipmentSlot('character', 'owner', slot as 1 | 2 | 3)).rejects.toThrow('inválido');
        expect(connection.startSession).not.toHaveBeenCalled();
    });

    it('uses one session for both writes and propagates failure without committing the simulated transaction', async () => {
        characterRepository.updateCharacterById.mockRejectedValueOnce(new Error('write failed'));
        await expect(service.buyEquipmentSlot('character', 'owner', 3)).rejects.toThrow('write failed');
        expect(userService.updateUserDataById).toHaveBeenCalledWith('owner', { md: 500 }, transaction);
        expect(characterRepository.updateCharacterById.mock.calls[0][2]).toBe(transaction as unknown as ClientSession);
        expect(transaction.withTransaction).toHaveBeenCalledTimes(1);
        expect(transaction.endSession).toHaveBeenCalledTimes(1);
        expect(md).toBe(1_000);
        expect(stored.equipo_options.equipo3_on).toBe(false);
    });

    it('can unlock the free first slot if its flag was false', async () => {
        stored.equipo_options.equipo1_on = false;
        stored.yang = 0;
        const { character: result, response } = await service.buyEquipmentSlot('character', 'owner', 1);
        expect(result.yang).toBe(0);
        expect(result.equipo_options.equipo1_on).toBe(true);
    });
});
