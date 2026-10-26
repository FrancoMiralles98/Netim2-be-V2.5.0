import { BadRequestException, NotFoundException } from '@nestjs/common';
import { IdItem, InventoryItem, ItemDTO } from 'netim2-shared';
import { CHEST_LIST } from '../../../item/const/miscs/chest/chest-list.const';
import { ESPADA_LIST } from '../../../item/const/equip/weapons/espada-list.const';
import { POCION_LIST } from '../../../item/const/miscs/pocion/pocion-list.const';
import type { ChestType, Reward } from 'netim2-shared';
import { ItemService } from '../../../item/item.service';
import { RngService } from '../../../shared/services/rng.service';
import { CharacterMapper } from '../../mapper/character-mapper';
import { GENERAL_CHARACTER } from '../../const/general-character.const';
import { CharacterChestService } from './character-chest.service';
import { CharacterBuffService } from './character-buff.service';
import { UpdateStatsService } from '../stats/update-stats.service';
import { CharacterLevelScalingService } from '../stats/calculator/character-level-scaling.service';
import { CharacterAttributesService } from '../stats/calculator/character-attributes.service';
import { EquipStatsCalculatorService } from '../stats/calculator/equip-stats-calculator.service';
import { BuffStatsCalculatorService } from '../stats/calculator/buff-stats-calculator.service';
import { LimitBonusService } from '../../../bonus/services/limit-bonus.service';
import { EXP_PER_LV } from '../../const/exp-per-lv.const';

describe('CharacterChestService', () => {
    const mapper = new CharacterMapper();
    const rng = new RngService();
    const stats = new UpdateStatsService(new CharacterLevelScalingService(), new CharacterAttributesService(),
        new EquipStatsCalculatorService(), new BuffStatsCalculatorService(), new LimitBonusService());
    let catalog: ChestType;
    const items = {
        getUpdatedInventoryItem: jest.fn((saved: InventoryItem) => ({ ...structuredClone(catalog), id: saved.id,
            position: saved.position, cantidad: saved.type === 'utility' ? saved.cantidad : 0 })),
        getCoreItemInfoByIdItem: jest.fn((id: number): ItemDTO => {
            const item = [ESPADA_LIST[0], ...POCION_LIST].find(item => item.idItem === id);
            if (!item) throw new Error('Item no encontrado');
            return structuredClone(item);
        }),
        getUpdatedImplicitBonus: jest.fn((item: ItemDTO) => item),
    };
    const service = new CharacterChestService(mapper, items as unknown as ItemService, rng, new CharacterBuffService(mapper, stats));
    const sword: Reward = { type_reward: 'item', idItem: IdItem.ESPADA, weight: 1000 };
    const potion: Reward = { type_reward: 'item', idItem: IdItem.POCION_ROJA_P, weight: 1000 };
    function character(rewards: Reward[] = [sword], config = 'all') {
        catalog = { ...structuredClone(CHEST_LIST[0]), rewardConfig: config, pickCount: 1, rewards } as ChestType;
        const source = structuredClone(GENERAL_CHARACTER);
        source.inventario = [{ ...structuredClone(catalog), id: 'chest', cantidad: 2, position: { row: 0, col: 0 } } as InventoryItem];
        return source;
    }
    function fill(source: ReturnType<typeof character>, freeColumns: number[] = []) {
        for (let row = 0; row < 6; row++) for (let col = 0; col < 19; col++) {
            if ((row === 0 && col === 0) || freeColumns.includes(col)) continue;
            source.inventario.push({ ...structuredClone(POCION_LIST[0]), id: `occupied-${row}-${col}`,
                cantidad: 1, size: { rows: 1, cols: 1 }, position: { row, col } });
        }
    }
    beforeEach(() => jest.clearAllMocks());
    afterEach(() => jest.restoreAllMocks());

    it('rolls inclusive quantity and upgrade ranges, grants unique equipment and consumes one selected chest', () => {
        jest.spyOn(Math, 'random').mockReturnValue(0.5);
        const source = character([{ ...sword, rewardOptions: { cantidadChances: { min: 2, max: 4 }, upgradeChances: { min: 1, max: 3 } } }]);
        const original = structuredClone(source);
        const result = service.openChest(source, { itemId: 'chest' });
        expect(result.response.newItems).toHaveLength(3);
        expect(new Set(result.response.newItems.map(item => item.id)).size).toBe(3);
        expect(result.response.newItems).toEqual(expect.arrayContaining([expect.objectContaining({ upgradeLv: 2 })]));
        expect(result.response.updatedItems).toEqual([{ id: 'chest', cantidad: 1 }]);
        expect(result.response.rewards).toEqual([{ type: 'item', idItem: IdItem.ESPADA, quantity: 3, upgradeLv: 2 }]);
        expect(items.getUpdatedImplicitBonus).toHaveBeenCalledWith(expect.objectContaining({ upgradeLv: 2 }));
        expect(source).toEqual(original);
    });

    it('splits large utility rewards into bounded stacks and reports the final amount of a merged stack', () => {
        const source = character([{ ...potion, rewardOptions: { cantidadChances: { min: 450, max: 450 } } }]);
        source.inventario.push({ ...structuredClone(POCION_LIST[0]), id: 'stack', cantidad: 180, position: { row: 0, col: 1 } });
        const result = service.openChest(source, { itemId: 'chest' });
        expect(result.response.updatedItems).toEqual([{ id: 'chest', cantidad: 1 }, { id: 'stack', cantidad: 200 }]);
        expect(result.response.newItems.map(item => item.type === 'utility' ? item.cantidad : 0)).toEqual([200, 200, 30]);
    });

    it('keeps reserve potions as individual instances', () => {
        const source = character([{ type_reward: 'item', idItem: IdItem.POCION_ROJA_M, weight: 1,
            rewardOptions: { cantidadChances: { min: 2, max: 2 } } }]);
        const result = service.openChest(source, { itemId: 'chest' });
        expect(result.response.newItems).toHaveLength(2);
        for (const item of result.response.newItems) expect(item).toMatchObject({ cantidad: 1, reserve: { actual: 1000 } });
    });

    it('adds yang to the character and requires no space for resources', () => {
        const source = character([
            { type_reward: 'resource', type_resource: 'yang', value_reward: 150, weight: 1 },
        ]);
        fill(source);
        const result = service.openChest(source, { itemId: 'chest' });
        expect(result.character.yang).toBe(source.yang + 150);
        expect(result.response.newItems).toEqual([]);
    });

    it('uses entity EXP progression and recalculates stats after gaining a level', () => {
        const source = character([{ type_reward: 'resource', type_resource: 'exp', value_reward: 2, weight: 1 }]);
        source.exp = source.exp_next_lv - 1;
        const result = service.openChest(source, { itemId: 'chest' });
        expect(result.character.lv).toBe(source.lv + 1);
        expect(result.response.progress).toMatchObject({ lv: source.lv + 1, exp: 1 });
        expect(result.response.stats).toEqual(result.character.stats);
        expect(result.response.attributes).toEqual(result.character.atributos);
    });

    it('grants every crossed milestone and skill point for a chest reward spanning multiple levels', () => {
        const value = EXP_PER_LV[1] + EXP_PER_LV[2] + EXP_PER_LV[3] / 4;
        const source = character([{ type_reward: 'resource', type_resource: 'exp', value_reward: value, weight: 1 }]);
        Object.assign(source, { lv: 1, exp: 0, exp_next_lv: EXP_PER_LV[1], atribute_per_lv: 0,
            puntos_atributos: 0, puntos_habilidad: 0 });
        const result = service.openChest(source, { itemId: 'chest' });
        expect(result.character).toMatchObject({ lv: 3, exp: 625, puntos_atributos: 7, puntos_habilidad: 2, atribute_per_lv: 1 });
        expect(result.response.progress).toEqual({ lv: 3, exp: 625, exp_next_lv: EXP_PER_LV[3],
            puntos_atributos: 7, puntos_habilidad: 2, atribute_per_lv: 1 });
    });

    it('rejects MD rewards before consuming the chest', () => {
        const source = character([{ type_reward: 'resource', type_resource: 'md', value_reward: 20, weight: 1 } as unknown as Reward]);
        const before = structuredClone(source);
        expect(() => service.openChest(source, { itemId: 'chest' })).toThrow('Recurso de recompensa inválido');
        expect(source).toEqual(before);
    });

    it.each(['all', 'random', 'pick'])('checks worst-case 1x3 spaces before any RNG for %s', config => {
        const source = character([{ ...sword, rewardOptions: { cantidadChances: { min: 3, max: 3 } } }], config);
        fill(source, [18]); // Solo caben dos bloques verticales de 1x3.
        const original = structuredClone(source);
        const random = jest.spyOn(rng, 'randomNumberInRange');
        expect(() => service.openChest(source, { itemId: 'chest', ...(config === 'pick' ? { selectedItemIds: [IdItem.ESPADA] } : {}) }))
            .toThrow('espacio suficiente');
        expect(random).not.toHaveBeenCalled();
        expect(source).toEqual(original);
    });

    it('checks separate spaces for every all reward and grants exactly the pick selection', () => {
        const source = character([sword, sword]);
        fill(source, [18]);
        expect(service.openChest(source, { itemId: 'chest' }).response.newItems).toHaveLength(2);
        const pick = character([sword, potion], 'pick');
        const result = service.openChest(pick, { itemId: 'chest', selectedItemIds: [IdItem.POCION_ROJA_P] });
        expect(result.response.newItems).toHaveLength(1);
        expect(result.response.newItems[0].idItem).toBe(IdItem.POCION_ROJA_P);
    });

    it('does not trust old reward tables and removes an exhausted chest', () => {
        const source = character([potion]);
        source.inventario[0] = { ...source.inventario[0], cantidad: 1, rewards: [sword] } as InventoryItem;
        const result = service.openChest(source, { itemId: 'chest' });
        expect(result.response.updatedItems).toEqual([{ id: 'chest', cantidad: 0 }]);
        expect(result.response.newItems[0].idItem).toBe(IdItem.POCION_ROJA_P);
    });

    it('rejects missing/non-chests, invalid stock, level, ranges and unsupported upgrades without mutation', () => {
        expect(() => service.openChest(character(), { itemId: 'missing' })).toThrow(NotFoundException);
        for (const patch of [{ cantidad: 0 }, { cantidad: 0.5 }, { type_utility: 'buff' }]) {
            const source = character();
            Object.assign(source.inventario[0], patch);
            expect(() => service.openChest(source, { itemId: 'chest' })).toThrow(BadRequestException);
        }
        const source = character();
        catalog.lvUtility = 999;
        expect(() => service.openChest(source, { itemId: 'chest' })).toThrow('nivel');
        for (const reward of [
            { ...sword, rewardOptions: { cantidadChances: { min: 2, max: 1 } } },
            { ...sword, rewardOptions: { upgradeChances: { min: 0, max: 99 } } },
            { ...potion, rewardOptions: { upgradeChances: { min: 0, max: 1 } } },
            { type_reward: 'resource', type_resource: 'yang', value_reward: -1, weight: 1 },
        ] as Reward[]) {
            const source = character([reward]);
            const before = structuredClone(source);
            expect(() => service.openChest(source, { itemId: 'chest' })).toThrow(BadRequestException);
            expect(source).toEqual(before);
        }
    });

    describe('bulk opening', () => {
        function bulkCharacter(rewards: Reward[] = [sword], quantity = 2) {
            const source = character(rewards, 'random');
            if (catalog.rewardConfig === 'random') catalog.allowBulkOpen = true;
            source.inventario[0] = { ...source.inventario[0], cantidad: quantity } as InventoryItem;
            return source;
        }

        it('rolls once per chest, grants all equipment and only consumes the selected stack', () => {
            const source = bulkCharacter();
            source.inventario.push({ ...source.inventario[0], id: 'other', cantidad: 5, position: { row: 0, col: 1 } } as InventoryItem);
            const before = structuredClone(source);
            const selector = jest.spyOn(rng, 'pickWeightedItem');
            const result = service.openChestBulk(source, { itemId: 'chest', quantity: 2 });
            expect(selector).toHaveBeenCalledTimes(2);
            expect(result.response.openedQuantity).toBe(2);
            expect(result.response.newItems).toHaveLength(2);
            expect(result.response.rewards).toHaveLength(2);
            expect(result.response.updatedItems).toEqual([{ id: 'chest', cantidad: 0 }]);
            expect(result.character.inventario.find(item => item.id === 'other')).toEqual(source.inventario[1]);
            expect(source).toEqual(before);
        });

        it('merges stackable rewards and returns each stack only once with its final quantity', () => {
            const source = bulkCharacter([{ ...potion, rewardOptions: { cantidadChances: { min: 200, max: 200 } } }], 3);
            source.inventario.push({ ...structuredClone(POCION_LIST[0]), id: 'stack', cantidad: 180, position: { row: 0, col: 1 } });
            const result = service.openChestBulk(source, { itemId: 'chest', quantity: 3 });
            expect(result.response.newItems.map(item => item.type === 'utility' ? item.cantidad : 0)).toEqual([200, 200, 180]);
            expect(result.response.updatedItems).toEqual([{ id: 'chest', cantidad: 0 }, { id: 'stack', cantidad: 200 }]);
        });

        it('supports large batches that merge entirely into an existing stack without needing new slots', () => {
            const source = bulkCharacter([potion], 100);
            fill(source);
            const result = service.openChestBulk(source, { itemId: 'chest', quantity: 100 });
            expect(result.response.newItems).toEqual([]);
            expect(result.response.rewards).toHaveLength(100);
            expect(result.response.updatedItems).toEqual(expect.arrayContaining([{ id: 'chest', cantidad: 0 }]));
        });

        it('accumulates Yang and EXP from independent draws and recalculates progression once for the batch', () => {
            const yang: Reward = { type_reward: 'resource', type_resource: 'yang', value_reward: 100, weight: 1 };
            const exp: Reward = { type_reward: 'resource', type_resource: 'exp', value_reward: EXP_PER_LV[1], weight: 1 };
            const source = bulkCharacter([yang, exp], 3);
            Object.assign(source, { exp: 0, exp_next_lv: EXP_PER_LV[1], atribute_per_lv: 0, puntos_atributos: 0, puntos_habilidad: 0 });
            jest.spyOn(rng, 'pickWeightedItem').mockReturnValueOnce(yang).mockReturnValueOnce(exp).mockReturnValueOnce(yang);
            const result = service.openChestBulk(source, { itemId: 'chest', quantity: 3 });
            expect(result.response.yang).toBe(source.yang + 200);
            expect(result.response.progress).toMatchObject({ lv: 2, exp: 0, puntos_atributos: 3, puntos_habilidad: 1 });
            expect(result.response.newItems).toEqual([]);
        });

        it.each([0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])('rejects invalid quantity %s', quantity => {
            expect(() => service.openChestBulk(bulkCharacter(), { itemId: 'chest', quantity })).toThrow(BadRequestException);
        });

        it('rejects insufficient stock, disabled bulk and non-random chests using current catalog settings', () => {
            const source = bulkCharacter();
            expect(() => service.openChestBulk(source, { itemId: 'chest', quantity: 3 })).toThrow('suficientes unidades');
            if (catalog.rewardConfig === 'random') catalog.allowBulkOpen = false;
            expect(() => service.openChestBulk(source, { itemId: 'chest', quantity: 1 })).toThrow('no permite');
            for (const config of ['all', 'pick']) {
                const source = character([sword], config);
                expect(() => service.openChestBulk(source, { itemId: 'chest', quantity: 1 })).toThrow('no permite');
            }
        });

        it('rejects the entire batch when its combined 1x3 space requirement does not fit', () => {
            const source = bulkCharacter([sword], 3);
            fill(source, [18]); // Caben tres espadas 1x2, pero no los tres espacios mínimos de 1x3.
            const before = structuredClone(source);
            expect(() => service.openChestBulk(source, { itemId: 'chest', quantity: 3 })).toThrow('espacio suficiente');
            expect(source).toEqual(before);
        });

        it('does not mutate the input if actual item insertion fails partway through a batch', () => {
            const source = bulkCharacter([sword], 4);
            fill(source, [18]);
            const before = structuredClone(source);
            expect(() => service.openChestBulk(source, { itemId: 'chest', quantity: 4 })).toThrow('espacio suficiente');
            expect(source).toEqual(before);
        });
    });
});
