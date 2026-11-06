import { Injectable } from '@nestjs/common';
import type { DamageSkillValueScaling, MechanicsEffectsKeys, SkillDamage } from 'netim2-shared';
import { SharedSkillScalingService } from '../shared-skill-scaling.service';
import type { SkillScalingContext } from '../../types/skill-scaling-context.type';

/** Calcula probabilidades de estados y valores de mecánicas; no aplica efectos al objetivo. */
@Injectable()
export class EffectsCalculatorService {
    constructor(private readonly scalingValues: SharedSkillScalingService) {}

    /** Devuelve chances en [0, 100] de estados desbloqueados; no calcula duraciones ni resistencias. */
    getStatusEffects(context: SkillScalingContext, scaling: DamageSkillValueScaling): SkillDamage['statusEffects'] {
        if (!scaling.statusEffects) return undefined;
        const result: NonNullable<SkillDamage['statusEffects']> = {};
        for (const effect of scaling.statusEffects) {
            if (!this.scalingValues.isUnlocked(effect.unlockAt, context)) continue;
            if (result[effect.effectId] !== undefined) throw new Error('Efecto de estado duplicado');
            result[effect.effectId] = this.scalingValues.calculateConstrainedValue(effect.chance, context, 0, false, 100);
        }
        return result;
    }

    /** Calcula valores no negativos de mecánicas como vampirismo o penetración, sin tope implícito de 100. */
    getMechanicsEffects(context: SkillScalingContext, scaling: DamageSkillValueScaling): SkillDamage['mechanicsEffects'] {
        if (!scaling.mechanicsEffects) return undefined;
        const result: NonNullable<SkillDamage['mechanicsEffects']> = {};
        for (const key of Object.keys(scaling.mechanicsEffects) as MechanicsEffectsKeys[]) {
            const value = scaling.mechanicsEffects[key];
            if (value) result[key] = this.scalingValues.calculateConstrainedValue(value, context, 0);
        }
        return result;
    }
}
