import type { SkillProgressionPoint, SkillValueScaling } from 'netim2-shared';
import { GENERAL_CHARACTER_STATS } from '../../character/const/characterProps/base-character-stats.const';
import { SharedSkillScalingService } from './shared-skill-scaling.service';
import type { SkillScalingContext } from '../types/skill-scaling-context.type';

const constant = (value: number): SkillValueScaling => ({ progression: { type: 'constant', value } });

describe('SharedSkillScalingService', () => {
    const service = new SharedSkillScalingService();
    const context = (progression: SkillProgressionPoint = { rank: 'N', level: 1 }): SkillScalingContext => ({ progression });
    const growth: SkillValueScaling = {
        progression: { type: 'per_level', base: 10, perLevel: { N: 1, M: 2, G: 3 }, perfectBonus: 5 },
    };

    it.each<[SkillProgressionPoint, number]>([
        [{ rank: 'N', level: 1 }, 10], [{ rank: 'N', level: 16 }, 25],
        [{ rank: 'M', level: 1 }, 27], [{ rank: 'M', level: 10 }, 45],
        [{ rank: 'G', level: 1 }, 48], [{ rank: 'G', level: 10 }, 75], [{ rank: 'P' }, 80],
    ])('accumulates progression at %j without losing previous ranks', (point, expected) => {
        expect(service.calculateValue(growth, context(point))).toBe(expected);
    });

    it('accepts custom rank limits and a missing perfect bonus', () => {
        expect(service.calculateValue(growth, { ...context({ rank: 'P' }),
            limits: { maxLevelByRank: { N: 5, M: 2, G: 3 } } })).toBe(32);
        expect(service.calculateValue({ progression: { type: 'per_level', base: 10,
            perLevel: { N: 1, M: 2, G: 3 } } }, context({ rank: 'P' }))).toBe(75);
    });

    it('adds all reached thresholds regardless of array order; repeated calls do not accumulate', () => {
        const scaling: SkillValueScaling = { progression: { type: 'thresholds', base: 1, thresholds: [
            { at: { rank: 'P' }, add: 2 }, { at: { rank: 'M', level: 5 }, add: 1 },
            { at: { rank: 'N', level: 10 }, add: 1 },
        ] } };
        expect(service.calculateValue(scaling, context())).toBe(1);
        expect(service.calculateValue(scaling, context({ rank: 'M', level: 4 }))).toBe(2);
        expect(service.calculateValue(scaling, context({ rank: 'M', level: 5 }))).toBe(3);
        expect(service.calculateValue(scaling, context({ rank: 'P' }))).toBe(5);
        expect(service.calculateValue(scaling, context({ rank: 'P' }))).toBe(5);
    });

    it('combines attribute totals, numeric stat paths, flat and accumulated percentage contributions', () => {
        const stats = structuredClone(GENERAL_CHARACTER_STATS);
        stats.general.ad.min = 100;
        stats.general.va = 20;
        const attributes = { STR: { lvPoints: 10, bonusPoints: 10 }, INT: { lvPoints: 10, bonusPoints: 0 },
            DEX: { lvPoints: 0, bonusPoints: 0 }, VIT: { lvPoints: 0, bonusPoints: 0 } };
        const snapshot = { ...context(), stats, attributes };
        const scaling: SkillValueScaling = { ...constant(10), contributions: [
            { source: { type: 'attribute', attribute: 'STR' }, operation: 'flat', coefficient: 0.5 },
            { source: { type: 'stat', path: 'general.ad.min' }, operation: 'flat', coefficient: 0.2 },
            { source: { type: 'attribute', attribute: 'INT' }, operation: 'increased', coefficient: 1 },
            { source: { type: 'stat', path: 'general.va' }, operation: 'increased', coefficient: 1 },
        ] };
        const before = structuredClone({ snapshot, scaling });
        expect(service.calculateValue(scaling, snapshot)).toBe(52);
        expect({ snapshot, scaling }).toEqual(before);
    });

    it('supports negative coefficients and signed stat modifiers', () => {
        const stats = structuredClone(GENERAL_CHARACTER_STATS);
        stats.general.va = 20;
        expect(service.calculateValue({ ...constant(100), contributions: [{
            source: { type: 'stat', path: 'general.va' }, operation: 'increased', coefficient: -1,
        }] }, { ...context(), stats })).toBe(80);
        expect(service.calculateStatModifiers([{ target: 'general.vm', operation: 'flat', value: constant(-25) }], context()))
            .toEqual([{ target: 'general.vm', bonusRefKey: 'vm', operation: 'flat', value: -25 }]);
    });

    it('clamps once and truncates positive and negative values without rounding', () => {
        expect(service.calculateValue({ ...constant(12.39), precision: 1 }, context())).toBe(12.3);
        expect(service.calculateValue({ ...constant(-12.39), precision: 1 }, context())).toBe(-12.3);
        expect(service.calculateValue({ ...constant(999), min: 0, max: 100 }, context())).toBe(100);
        expect(Object.is(service.calculateValue({ ...constant(-0.09), precision: 0 }, context()), -0)).toBe(false);
    });

    it('calculates cooldown events separately and preserves omission versus an explicit zero', () => {
        expect(service.calculateCooldowns({ onActivate: constant(2.9), onDeactivate: constant(-5) }, context()))
            .toEqual({ onActivate: 2, onDeactivate: 0 });
        expect(service.calculateCooldowns({}, context())).toEqual({});
    });

    it('calculates free, instant and independent upkeep costs', () => {
        expect(service.calculateManaCost({ type: 'none' }, context())).toEqual({ type: 'none' });
        expect(service.calculateManaCost({ type: 'instant', amount: growth }, context({ rank: 'G', level: 1 })))
            .toEqual({ type: 'instant', amount: 48 });
        expect(service.calculateManaCost({ type: 'upkeep', initialAmount: constant(20), amountPerTurn: constant(7) }, context()))
            .toEqual({ type: 'upkeep', initialAmount: 20, amountPerTurn: 7 });
        expect(service.calculateManaCost({ type: 'upkeep', amountPerTurn: constant(3.5) }, context()))
            .toEqual({ type: 'upkeep', amountPerTurn: 3.5 });
        expect(service.calculateManaCost({ type: 'instant', amount: constant(-20) }, context()))
            .toEqual({ type: 'instant', amount: 0 });
    });

    it('returns explicit duration variants and positive integer turns', () => {
        expect(service.calculateDuration({ type: 'until_no_mana' }, context())).toEqual({ type: 'until_no_mana' });
        expect(service.calculateDuration({ type: 'turns', turns: constant(3.9) }, context())).toEqual({ type: 'turns', turns: 3 });
        expect(service.calculateDuration({ type: 'turns', turns: constant(0) }, context())).toEqual({ type: 'turns', turns: 1 });
    });

    it('calculates base damage plus AD independently for each endpoint', () => {
        const stats = structuredClone(GENERAL_CHARACTER_STATS);
        stats.general.ad = { min: 100, max: 150 };
        const snapshot = { ...context(), stats };
        expect(service.calculateRange({
            min: { ...constant(50), contributions: [{ source: { type: 'stat', path: 'general.ad.min' }, operation: 'flat', coefficient: 1.2 }] },
            max: { ...constant(80), contributions: [{ source: { type: 'stat', path: 'general.ad.max' }, operation: 'flat', coefficient: 1.2 }] },
        }, snapshot)).toEqual({ min: 170, max: 260 });
        expect(() => service.calculateRange({ min: constant(20), max: constant(10) }, context())).toThrow('mínimo');
    });

    it('derives bonus references and allocates fresh modifier objects', () => {
        const scaling = [{ target: 'bonus.daño.media' as const, operation: 'increased' as const, value: growth }];
        const before = structuredClone(scaling);
        expect(service.calculateStatModifiers(scaling, context({ rank: 'M', level: 1 })))
            .toEqual([{ target: 'bonus.daño.media', bonusRefKey: 'media', operation: 'increased', value: 27 }]);
        expect(scaling).toEqual(before);
        expect(service.calculateStatModifiers([], context())).toEqual([]);
    });

    it('uses mastery independently of the numeric level for contexts and unlocks', () => {
        const snapshot = service.createContext({ mastery: 'G', lv: 1 });
        expect(snapshot.progression).toEqual({ rank: 'G', level: 1 });
        expect(service.calculateValue(growth, snapshot)).toBe(48);
        expect(service.isUnlocked({ rank: 'M', level: 10 }, snapshot)).toBe(true);
        expect(service.isUnlocked({ rank: 'G', level: 2 }, snapshot)).toBe(false);
        expect(service.isUnlocked({ rank: 'P' }, snapshot)).toBe(false);
        expect(service.isUnlocked(undefined, snapshot)).toBe(true);
        expect(service.createContext({ mastery: 'P', lv: 1 }).progression).toEqual({ rank: 'P' });
    });

    it.each([0, -1, 17, 1.5, NaN, Infinity])('rejects invalid N levels: %s', level => {
        expect(() => service.calculateValue(constant(1), context({ rank: 'N', level }))).toThrow('Nivel');
    });

    it('rejects invalid numbers, limits, precision and unavailable sources', () => {
        expect(() => service.calculateValue(constant(NaN), context())).toThrow('finito');
        expect(() => service.calculateValue({ ...constant(1), min: 2, max: 1 }, context())).toThrow('invertidos');
        expect(() => service.calculateValue({ ...constant(1), precision: -1 }, context())).toThrow('precisión');
        expect(() => service.calculateValue({ ...constant(0), min: 1.5, precision: 0 }, context())).toThrow('incompatibles');
        expect(() => service.calculateValue(constant(1), { ...context(), limits: { maxLevelByRank: { N: 0, M: 10, G: 10 } } })).toThrow('Límite');
        expect(() => service.calculateValue({ ...constant(1), contributions: [{ source: { type: 'attribute', attribute: 'INT' }, operation: 'flat', coefficient: 1 }] }, context())).toThrow('Faltan atributos');
        expect(() => service.calculateValue({ ...constant(1), contributions: [{ source: { type: 'stat', path: 'general.va' }, operation: 'flat', coefficient: 1 }] }, context())).toThrow('No existe');
        const invalid = { ...constant(1), contributions: [{ source: { type: 'stat', path: 'general.ad' }, operation: 'flat', coefficient: 1 }] } as unknown as SkillValueScaling;
        expect(() => service.calculateValue(invalid, { ...context(), stats: structuredClone(GENERAL_CHARACTER_STATS) })).toThrow('no es numérica');
    });
});
