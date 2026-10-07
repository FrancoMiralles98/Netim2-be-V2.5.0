import { Injectable } from "@nestjs/common";
import { SkillDamage } from "netim2-shared";
import { SkillDamageScaling } from "../../types/scaling/damage/skill-damage-scaling.type";

@Injectable()
export class EffectsCalculatorService {
    getStatusEffects(
        lvPoints: number,
        scaling: SkillDamageScaling
    ): SkillDamage['statusEffects'] | undefined {
        if (!scaling.statusEffectScaling) {
            return undefined
        }
        const statusEffects: SkillDamage['statusEffects'] = {}

        Object.entries(scaling.statusEffectScaling).forEach(([key, effectScaling]) => {
            statusEffects[key] = Math.max(0,Math.min(100, effectScaling.base + (effectScaling.perLv * lvPoints)))
        })

        return statusEffects
    }

    getMechanicsEffects(
        lvPoints: number,
        scaling: SkillDamageScaling
    ): SkillDamage['mechanicsEffects'] | undefined {
        if (!scaling.mechanicsEffectScaling) {
            return undefined
        }
        const mechanicsEffects: SkillDamage['mechanicsEffects'] = {}

        Object.entries(scaling.mechanicsEffectScaling).forEach(([key, effectScaling]) => {
            mechanicsEffects[key] = effectScaling.base + (effectScaling.perLv * lvPoints)
        })

        return mechanicsEffects
    }
}