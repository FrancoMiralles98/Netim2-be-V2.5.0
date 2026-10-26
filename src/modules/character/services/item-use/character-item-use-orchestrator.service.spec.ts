import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Connection } from 'mongoose';
import { NormalPotion, InventoryItem, ReservePotion } from 'netim2-shared';
import { ItemService } from '../../../item/item.service';
import { ItemHydrationService } from '../../../item/services/item-hydration.service';
import { POCION_LIST } from '../../../item/const/miscs/pocion/pocion-list.const';
import { GENERAL_CHARACTER } from '../../const/general-character.const';
import { CharacterMapper } from '../../mapper/character-mapper';
import { CharacterRepository } from '../../repository/character-repository';
import { CharacterItemUseOrchestratorService } from './character-item-use-orchestrator.service';
import { CharacterPotionService } from './character-potion.service';
import { CharacterBuffService } from './character-buff.service';
import { CharacterChestService } from './character-chest.service';

describe('CharacterItemUseOrchestratorService', () => {
    const mapper = new CharacterMapper();
    const potions = new CharacterPotionService(mapper);
    let source: typeof GENERAL_CHARACTER;
    let repository: { getCharacterById: jest.Mock; updateCharacterById: jest.Mock };
    let session: { withTransaction: jest.Mock; endSession: jest.Mock };
    let service: CharacterItemUseOrchestratorService;
    const buffs = { applyBuff: jest.fn(), refreshBuffs: jest.fn() };
    const chests = { openChest: jest.fn(), openChestBulk: jest.fn() };

    beforeEach(() => {
        chests.openChest.mockReset();
        chests.openChestBulk.mockReset();
        buffs.applyBuff.mockReset();
        buffs.refreshBuffs.mockReset();
        source = structuredClone(GENERAL_CHARACTER);
        source.stats.general.hp = { actual: 100, max: 1000 };
        source.stats.general.mana = { actual: 50, max: 500 };
        source.inventario = [{ ...structuredClone(POCION_LIST[0]), id: 'potion', cantidad: 3, potionType: 'normal',
            effect: [{ resource: 'hp', amount: 300 }], position: { row: 0, col: 0 } }];
        repository = {
            getCharacterById: jest.fn().mockImplementation(async () => ({ ...structuredClone(source), user_owner: 'owner' })),
            updateCharacterById: jest.fn().mockResolvedValue(undefined),
        };
        session = { withTransaction: jest.fn(async callback => callback()), endSession: jest.fn().mockResolvedValue(undefined) };
        const connection = { startSession: jest.fn().mockResolvedValue(session) };
        const items = { getUpdatedInventoryItem: jest.fn((item: InventoryItem) =>
            new ItemHydrationService().hydrateInventoryItem(POCION_LIST.find(base => base.idItem === item.idItem)!, item)) };
        service = new CharacterItemUseOrchestratorService(repository as unknown as CharacterRepository, mapper, potions,
            connection as unknown as Connection, items as unknown as ItemService, buffs as unknown as CharacterBuffService, chests as unknown as CharacterChestService);
    });

    it('loads once, saves resource paths and inventory together and returns only the response', async () => {
        const original = structuredClone(source);
        const response = await service.usePotion('character', 'owner', { itemId: 'potion', quantity: 2 });
        expect(response).toEqual({ hp: 700, mana: 50, updatedItems: [{ id: 'potion', cantidad: 1 }] });
        expect(repository.getCharacterById).toHaveBeenCalledTimes(1);
        expect(repository.getCharacterById).toHaveBeenCalledWith('character', session);
        expect(repository.updateCharacterById).toHaveBeenCalledTimes(1);
        expect(repository.updateCharacterById).toHaveBeenCalledWith('character', {
            inventario: [{ ...source.inventario[0], cantidad: 1 }], 'stats.general.hp.actual': 700,
        }, session);
        expect(source).toEqual(original);
        expect(session.endSession).toHaveBeenCalledTimes(1);
    });

    it('persists reduced reserves even when the item quantity stays unchanged', async () => {
        const { effect, ...base } = source.inventario[0] as InventoryItem & NormalPotion;
        source.inventario[0] = { ...base, cantidad: 1, potionType: 'reserve', resource: ['mana'], reserve: { max: 1000, actual: 1000 } };
        const response = await service.useReservePotion('character', 'owner', { itemId: 'potion' });
        expect(response.mana).toBe(500);
        expect(response.updatedPotion!.reserve).toEqual({ max: 1000, actual: 550 });
        expect(repository.updateCharacterById).toHaveBeenCalledWith('character', {
            inventario: [{ ...source.inventario[0], resource: response.updatedPotion!.resource, reserve: response.updatedPotion!.reserve }],
            'stats.general.mana.actual': 500,
        }, session);
    });

    it('persists quick heal stack removal and final HP', async () => {
        expect(await service.quickHeal('character', 'owner', { resources: ['hp'] })).toEqual({
            hp: 1000, mana: 50, updatedItems: [{ id: 'potion', cantidad: 0 }], updatedPotions: [],
        });
        expect(repository.updateCharacterById).toHaveBeenCalledWith('character', {
            inventario: [], 'stats.general.hp.actual': 1000,
        }, session);
    });

    it.each(['reserve', 'quick'] as const)('hydrates legacy reserves before %s use and persists the remaining balance', async action => {
        const base = POCION_LIST[1] as ReservePotion;
        const { resource, ...legacy } = structuredClone(base);
        source.stats.general.hp.actual = 900;
        source.inventario = [{ ...legacy, id: 'legacy', cantidad: 1, position: { row: 0, col: 0 },
            reserve: { max: 1000, actual: 600 }, effect: [{ resource: 'hp', amount: 700 }] } as unknown as InventoryItem];
        const before = structuredClone(source);
        const response = action === 'reserve'
            ? await service.useReservePotion('character', 'owner', { itemId: 'legacy' })
            : await service.quickHeal('character', 'owner', { resources: ['hp'] });
        const updatedPotion = 'updatedPotion' in response ? response.updatedPotion : response.updatedPotions[0];
        expect(updatedPotion).toEqual({ id: 'legacy', resource: ['hp'], reserve: { max: 1000, actual: 500 } });
        expect(response.hp).toBe(1000);
        expect(repository.updateCharacterById).toHaveBeenCalledWith('character', {
            inventario: [{ ...base, id: 'legacy', cantidad: 1, position: { row: 0, col: 0 }, reserve: { max: 1000, actual: 500 } }],
            'stats.general.hp.actual': 1000,
        }, session);
        expect(source).toEqual(before);
    });

    it('rejects foreign characters before executing or saving an action', async () => {
        const action = jest.spyOn(potions, 'usePotion');
        try {
            await expect(service.usePotion('character', 'other', { itemId: 'potion', quantity: 1 })).rejects.toBeInstanceOf(ForbiddenException);
            expect(action).not.toHaveBeenCalled();
            expect(repository.updateCharacterById).not.toHaveBeenCalled();
            expect(session.endSession).toHaveBeenCalledTimes(1);
        } finally { action.mockRestore(); }
    });

    it('does not save invalid actions or return success if saving fails', async () => {
        await expect(service.usePotion('character', 'owner', { itemId: 'potion', quantity: 4 })).rejects.toBeInstanceOf(BadRequestException);
        expect(repository.updateCharacterById).not.toHaveBeenCalled();
        repository.updateCharacterById.mockRejectedValue(new Error('write failed'));
        await expect(service.usePotion('character', 'owner', { itemId: 'potion', quantity: 1 })).rejects.toThrow('write failed');
        expect(session.endSession).toHaveBeenCalledTimes(2);
    });

    it('propagates missing characters and closes the session', async () => {
        repository.getCharacterById.mockRejectedValue(new NotFoundException());
        await expect(service.quickHeal('missing', 'owner', { resources: ['hp'] })).rejects.toBeInstanceOf(NotFoundException);
        expect(repository.updateCharacterById).not.toHaveBeenCalled();
        expect(session.endSession).toHaveBeenCalledTimes(1);
    });

    it('skips a write when quick heal changes nothing', async () => {
        source.stats.general.hp.actual = source.stats.general.hp.max;
        await service.quickHeal('character', 'owner', { resources: ['hp'] });
        expect(repository.updateCharacterById).not.toHaveBeenCalled();
    });

    it.each(['apply', 'refresh'] as const)('persists %s buff changes and returns the domain response', async action => {
        const updated = structuredClone(source);
        updated.stats.general.def += 100;
        updated.atributos.STR.bonusPoints = 2;
        updated.buffos = [{ implicitBonus: [], corruptBonus: [], id_buff: 1, buff_duration: 60,
            buff_base_duration: 60, buff_inicialization: Date.now(), buff_name: 'Buff', buff_description: '' }];
        if (action === 'apply') (updated.inventario[0] as NormalPotion).cantidad -= 1;
        const response = { stats: updated.stats, attributes: updated.atributos, buffos: updated.buffos,
            ...(action === 'apply' ? { updatedItems: [{ id: 'potion', cantidad: 2 }] } : {}) };
        (action === 'apply' ? buffs.applyBuff : buffs.refreshBuffs).mockReturnValue({ character: updated, response });
        const actual = action === 'apply'
            ? await service.applyBuff('character', 'owner', { itemId: 'potion' })
            : await service.refreshBuffs('character', 'owner');
        expect(actual).toBe(response);
        expect(repository.getCharacterById).toHaveBeenCalledTimes(1);
        expect(repository.updateCharacterById).toHaveBeenCalledWith('character', {
            stats: updated.stats, atributos: updated.atributos, buffos: updated.buffos,
            ...(action === 'apply' ? { inventario: updated.inventario } : {}),
        }, session);
        if (action === 'apply') expect(buffs.applyBuff).toHaveBeenCalledWith(source, { itemId: 'potion' });
        else expect(buffs.refreshBuffs).toHaveBeenCalledWith(source);
    });

    it('does not execute buff actions for a foreign character', async () => {
        await expect(service.applyBuff('character', 'other', { itemId: 'potion' })).rejects.toBeInstanceOf(ForbiddenException);
        await expect(service.refreshBuffs('character', 'other')).rejects.toBeInstanceOf(ForbiddenException);
        expect(buffs.applyBuff).not.toHaveBeenCalled();
        expect(buffs.refreshBuffs).not.toHaveBeenCalled();
        expect(repository.updateCharacterById).not.toHaveBeenCalled();
    });

    it('opens a chest and persists inventory and yang under the same session', async () => {
        const updated = structuredClone(source);
        updated.inventario = [];
        updated.yang += 100;
        chests.openChest.mockReturnValue({ character: updated,
            response: { newItems: [], updatedItems: [{ id: 'potion', cantidad: 0 }], rewards: [], yang: updated.yang } });
        const response = await service.openChest('character', 'owner', { itemId: 'potion' });
        expect(response).toEqual({ newItems: [], updatedItems: [{ id: 'potion', cantidad: 0 }], rewards: [], yang: updated.yang });
        expect(chests.openChest).toHaveBeenCalledWith(source, { itemId: 'potion' });
        expect(repository.updateCharacterById).toHaveBeenCalledWith('character', { inventario: [], yang: updated.yang }, session);
        expect(session.endSession).toHaveBeenCalledTimes(1);
    });

    it('saves EXP progress and recalculated stats in the same transaction', async () => {
        const updated = structuredClone(source);
        updated.lv = 2;
        const progress = { lv: 2, exp: updated.exp, exp_next_lv: updated.exp_next_lv, puntos_atributos: updated.puntos_atributos,
            puntos_habilidad: updated.puntos_habilidad, atribute_per_lv: updated.atribute_per_lv };
        chests.openChest.mockReturnValue({ character: updated,
            response: { newItems: [], updatedItems: [], rewards: [], yang: updated.yang, progress } });
        await service.openChest('character', 'owner', { itemId: 'potion' });
        expect(repository.updateCharacterById).toHaveBeenCalledWith('character', {
            inventario: updated.inventario, yang: updated.yang, ...progress,
            stats: updated.stats, atributos: updated.atributos, buffos: updated.buffos,
        }, session);
    });

    it('rejects foreign chest actions and does not return success if saving fails', async () => {
        await expect(service.openChest('character', 'other', { itemId: 'potion' })).rejects.toBeInstanceOf(ForbiddenException);
        expect(chests.openChest).not.toHaveBeenCalled();
        expect(repository.updateCharacterById).not.toHaveBeenCalled();
        chests.openChest.mockReturnValue({ character: structuredClone(source), response: { yang: 0 } });
        repository.updateCharacterById.mockRejectedValue(new Error('write failed'));
        await expect(service.openChest('character', 'owner', { itemId: 'potion' })).rejects.toThrow('write failed');
        expect(session.endSession).toHaveBeenCalledTimes(2);
    });

    it('opens a bulk operation with one read and one final write', async () => {
        const updated = structuredClone(source);
        updated.inventario = [];
        updated.yang += 200;
        const response = { newItems: [], updatedItems: [{ id: 'potion', cantidad: 0 }], rewards: [], yang: updated.yang, openedQuantity: 3 };
        chests.openChestBulk.mockReturnValue({ character: updated, response });
        expect(await service.openChestBulk('character', 'owner', { itemId: 'potion', quantity: 3 })).toBe(response);
        expect(chests.openChestBulk).toHaveBeenCalledWith(source, { itemId: 'potion', quantity: 3 });
        expect(repository.getCharacterById).toHaveBeenCalledTimes(1);
        expect(repository.updateCharacterById).toHaveBeenCalledTimes(1);
        expect(repository.updateCharacterById).toHaveBeenCalledWith('character', { inventario: [], yang: updated.yang }, session);
    });

    it('does not execute unauthorized bulk operations or persist failed simulations', async () => {
        await expect(service.openChestBulk('character', 'other', { itemId: 'potion', quantity: 2 })).rejects.toBeInstanceOf(ForbiddenException);
        expect(chests.openChestBulk).not.toHaveBeenCalled();
        chests.openChestBulk.mockImplementation(() => { throw new BadRequestException('No hay espacio'); });
        await expect(service.openChestBulk('character', 'owner', { itemId: 'potion', quantity: 2 })).rejects.toThrow('No hay espacio');
        expect(repository.updateCharacterById).not.toHaveBeenCalled();
        expect(session.endSession).toHaveBeenCalledTimes(2);
    });
});
