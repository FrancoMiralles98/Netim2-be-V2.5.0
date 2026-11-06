import type { DamageSkillValueScaling, SkillValueScaling } from 'netim2-shared';
import { SharedSkillScalingService } from '../shared-skill-scaling.service';
import { ModifiersCalculatorService } from './modifiers-calculator.service';

const constant = (value: number): SkillValueScaling => ({ progression: { type: 'constant', value } });

describe('ModifiersCalculatorService with shared value scaling', () => {
    const service = new ModifiersCalculatorService(new SharedSkillScalingService());
    const context = { progression: { rank: 'N', level: 1 } as const };
    // Estos métodos consumen solo los modificadores; el resto del contrato se comprueba en DamageSkillService.
    const config = (modifiers: Pick<DamageSkillValueScaling, 'hitModifiers' | 'damageModifiers'>) => modifiers as DamageSkillValueScaling;

    it('keeps weights above 100, filters locked outcomes and scales the multiplier itself', () => {
        const scaling = config({ damageModifiers: { type: 'weighted_multiplier', options: [
            { id: 'normal', weight: constant(200), multiplier: constant(1) },
            { id: 'double', weight: constant(100), multiplier: { progression: { type: 'thresholds', base: 2,
                thresholds: [{ at: { rank: 'M', level: 1 }, add: 0.25 }] } } },
            { id: 'triple', unlockAt: { rank: 'G', level: 1 }, weight: constant(50), multiplier: constant(3) },
        ] } });
        const before = structuredClone(scaling);
        expect(service.getDamageModifier(context, scaling)).toEqual({ type: 'weighted_multiplier', options: [
            { chance: 200, multiplier: 1 }, { chance: 100, multiplier: 2 },
        ] });
        expect(service.getDamageModifier({ progression: { rank: 'G', level: 1 } }, scaling)).toEqual({ type: 'weighted_multiplier', options: [
            { chance: 200, multiplier: 1 }, { chance: 100, multiplier: 2.25 }, { chance: 50, multiplier: 3 },
        ] });
        expect(scaling).toEqual(before);
    });

    it('clamps probabilities but not weights, and produces integer total hit counts', () => {
        expect(service.getHitModifier(context, config({ hitModifiers: { type: 'chance_multi_hit', chance: constant(130),
            hits: constant(3.9), damageMultiplierPerHit: constant(0.5) } })))
            .toEqual({ type: 'chance_multi_hit', chance: 100, hits: 3, damageMultiplierPerHit: 0.5 });
        expect(service.getDamageModifier(context, config({ damageModifiers: { type: 'chance_multiplier', chance: constant(-5), multiplier: constant(2) } })))
            .toEqual({ type: 'chance_multiplier', chance: 0, multiplier: 2 });
    });

    it('returns no modifier before unlock and rejects duplicate IDs or zero total weight', () => {
        expect(service.getHitModifier(context, config({ hitModifiers: { type: 'chance_multi_hit', unlockAt: { rank: 'M', level: 1 },
            chance: constant(20), hits: constant(2), damageMultiplierPerHit: constant(1) } }))).toBeUndefined();
        expect(() => service.getDamageModifier(context, config({ damageModifiers: { type: 'weighted_multiplier', options: [
            { id: 'only', weight: constant(0), multiplier: constant(2) },
        ] } }))).toThrow('peso total');
        expect(() => service.getDamageModifier(context, config({ damageModifiers: { type: 'weighted_multiplier', options: [
            { id: 'same', weight: constant(10), multiplier: constant(2) },
            { id: 'same', weight: constant(10), multiplier: constant(3) },
        ] } }))).toThrow('duplicado');
    });
});
