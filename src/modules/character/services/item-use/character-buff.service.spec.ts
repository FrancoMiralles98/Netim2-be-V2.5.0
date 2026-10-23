import { BadRequestException, NotFoundException } from '@nestjs/common';
import { allFullNameBonusList, AppliedBuffos, BonusInItem, InventoryItem } from 'netim2-shared';
import { BUFF_LIST } from '../../../item/const/miscs/buff/buff-list.const';
import { GENERAL_CHARACTER } from '../../const/general-character.const';
import { CharacterMapper } from '../../mapper/character-mapper';
import { MAX_ACTIVE_BUFF } from '../../config/buffs.config';
import { UpdateStatsService } from '../stats/update-stats.service';
import { CharacterLevelScalingService } from '../stats/calculator/character-level-scaling.service';
import { CharacterAttributesService } from '../stats/calculator/character-attributes.service';
import { EquipStatsCalculatorService } from '../stats/calculator/equip-stats-calculator.service';
import { BuffStatsCalculatorService } from '../stats/calculator/buff-stats-calculator.service';
import { LimitBonusService } from '../../../bonus/services/limit-bonus.service';
import { CharacterBuffService } from './character-buff.service';

describe('CharacterBuffService', () => {
    const stats = new UpdateStatsService(new CharacterLevelScalingService(), new CharacterAttributesService(),
        new EquipStatsCalculatorService(), new BuffStatsCalculatorService(), new LimitBonusService());
    const service = new CharacterBuffService(new CharacterMapper(), stats);
    const start = 100_000;

    function buff(duration: number, initialized = start): AppliedBuffos {
        return {
            implicitBonus: [], corruptBonus: [], buff_duration: duration,
            buff_base_duration: 999, buff_inicialization: initialized,
            id_buff: 1, buff_name: 'Buff', buff_description: '',
        };
    }

    afterEach(() => jest.restoreAllMocks());

    it('removes expired buffs using their actual duration without mutating the input', () => {
        const clock = jest.spyOn(Date, 'now').mockReturnValue(start + 60_000);
        const buffs = [buff(30), buff(60), buff(61), buff(120)];
        const original = structuredClone(buffs);
        expect(service.removeExpiredBuffs(buffs)).toEqual([buffs[2], buffs[3]]);
        expect(buffs).toEqual(original);
        expect(clock).toHaveBeenCalledTimes(1);
    });

    it.each([[59_999, 1], [60_000, 0], [60_001, 0]])(
        'at elapsed %i milliseconds returns %i active buffs', (elapsed, expected) => {
            jest.spyOn(Date, 'now').mockReturnValue(start + elapsed);
            expect(service.removeExpiredBuffs([buff(60)])).toHaveLength(expected);
        },
    );

    it('returns an empty array for no buffs or a zero-duration buff applied now', () => {
        jest.spyOn(Date, 'now').mockReturnValue(start);
        expect(service.removeExpiredBuffs([])).toEqual([]);
        expect(service.removeExpiredBuffs([buff(0)])).toEqual([]);
    });

    function character(quantity = 2) {
        const source = structuredClone(GENERAL_CHARACTER);
        const hp: BonusInItem = { bonusRef: 'hp', bonusFullName: allFullNameBonusList.MAX_HP,
            bonusValue: 100, origin: 'configured', category: { type: 'generic', tier: 1 }, displayFormat: 'flat',
            effects: { type: 'stat_modifiers', target: ['general.hp'], operation: 'flat' } };
        const str: BonusInItem = { ...hp, bonusRef: 'STR',
            bonusValue: 2, effects: { type: 'attribute_modifier', target: 'atribute.STR.bonusPoints', operation: 'flat' } };
        source.inventario = [{ ...structuredClone(BUFF_LIST[0]), id: 'buff-item', cantidad: quantity,
            position: { row: 0, col: 0 }, duration: 2, idBuff: 44, implicitBonus: [hp], corruptBonus: [str] }];
        source.stats.general.hp.actual = 10;
        source.stats.general.mana.actual = 5;
        return source;
    }

    it('consumes one unit, maps minutes to seconds and recalculates stats and attributes without mutation', () => {
        jest.spyOn(Date, 'now').mockReturnValue(start);
        const source = character();
        const original = structuredClone(source);
        const base = service.refreshBuffs(source).response;
        const result = service.applyBuff(source, { itemId: 'buff-item' });
        expect(result.response.updatedItems).toEqual([{ id: 'buff-item', cantidad: 1 }]);
        expect(result.character.inventario[0]).toMatchObject({ cantidad: 1 });
        expect(result.response.buffos).toEqual([expect.objectContaining({ id_buff: 44,
            buff_duration: 120, buff_base_duration: 120, buff_inicialization: start,
            buff_name: BUFF_LIST[0].name, buff_description: BUFF_LIST[0].description })]);
        expect(result.response.stats.general.hp.max).toBe(base.stats.general.hp.max + 100);
        expect(result.response.stats.general.ad.min).toBeGreaterThan(base.stats.general.ad.min);
        expect(result.response.attributes.STR.bonusPoints).toBe(2);
        expect(result.response.stats.general.hp.actual).toBe(10);
        expect(source).toEqual(original);
    });

    it('removes the item when its last unit is consumed', () => {
        const result = service.applyBuff(character(1), { itemId: 'buff-item' });
        expect(result.character.inventario).toEqual([]);
        expect(result.response.updatedItems).toEqual([{ id: 'buff-item', cantidad: 0 }]);
    });

    it('replaces an active buff of the same type, including when all slots are occupied', () => {
        jest.spyOn(Date, 'now').mockReturnValue(start);
        const source = character();
        source.buffos = [
            { ...buff(60), id_buff: 44, buff_name: 'Buff anterior' },
            ...Array.from({ length: MAX_ACTIVE_BUFF - 1 }, (_, id) => ({ ...buff(60), id_buff: id })),
        ];
        const original = structuredClone(source);
        const result = service.applyBuff(source, { itemId: 'buff-item' });
        expect(result.response.buffos).toHaveLength(MAX_ACTIVE_BUFF);
        expect(result.response.buffos.filter(buff => buff.id_buff === 44)).toEqual([
            expect.objectContaining({ buff_name: BUFF_LIST[0].name, buff_inicialization: start }),
        ]);
        expect(result.response.updatedItems).toEqual([{ id: 'buff-item', cantidad: 1 }]);
        expect(source).toEqual(original);
    });

    it('rejects a new buff when the active buff limit is reached without consuming items', () => {
        jest.spyOn(Date, 'now').mockReturnValue(start);
        const source = character();
        source.buffos = Array.from({ length: MAX_ACTIVE_BUFF }, (_, id) => ({ ...buff(60), id_buff: id }));
        const original = structuredClone(source);
        expect(() => service.applyBuff(source, { itemId: 'buff-item' })).toThrow('9 buffos');
        expect(source).toEqual(original);
    });

    it('discards expired duplicates before checking the limit and permits the ninth active buff', () => {
        jest.spyOn(Date, 'now').mockReturnValue(start + 60_000);
        const source = character();
        source.buffos = [{ ...buff(60), id_buff: 44 }, ...Array.from({ length: 8 }, (_, id) => ({ ...buff(120), id_buff: id }))];
        const result = service.applyBuff(source, { itemId: 'buff-item' });
        expect(result.response.buffos).toHaveLength(MAX_ACTIVE_BUFF);
        expect(result.response.buffos.filter(buff => buff.id_buff === 44)).toHaveLength(1);
    });

    it('refreshes expirations, removes their bonuses and clamps resources to the new maximum', () => {
        jest.spyOn(Date, 'now').mockReturnValue(start);
        const applied = service.applyBuff(character(), { itemId: 'buff-item' }).character;
        applied.stats.general.hp.actual = applied.stats.general.hp.max;
        const before = structuredClone(applied);
        jest.spyOn(Date, 'now').mockReturnValue(start + 120_000);
        const result = service.refreshBuffs(applied);
        expect(result.response.buffos).toEqual([]);
        expect(result.response.attributes.STR.bonusPoints).toBe(0);
        expect(result.response.stats.general.hp.max).toBe(applied.stats.general.hp.max - 100);
        expect(result.response.stats.general.hp.actual).toBe(result.response.stats.general.hp.max);
        expect(result.character.inventario).toEqual(applied.inventario);
        expect(applied).toEqual(before);
        expect(service.refreshBuffs(result.character)).toEqual(result);
    });

    it('rejects missing items, non-buffs, insufficient stock, invalid config and insufficient level', () => {
        expect(() => service.applyBuff(character(), { itemId: 'missing' })).toThrow(NotFoundException);
        expect(() => service.applyBuff(character(), { itemId: '  ' })).toThrow(BadRequestException);
        for (const patch of [{ cantidad: 0 }, { cantidad: 0.5 }, { duration: 0 }, { duration: Infinity },
            { idBuff: NaN }, { lvUtility: 999 }, { type_utility: 'poción' }]) {
            const source = character();
            Object.assign(source.inventario[0], patch);
            const before = structuredClone(source);
            expect(() => service.applyBuff(source, { itemId: 'buff-item' })).toThrow(BadRequestException);
            expect(source).toEqual(before);
        }
    });
});
