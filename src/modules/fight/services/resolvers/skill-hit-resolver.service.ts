import { Injectable } from "@nestjs/common";
import { DamageComponentResolution, DamageHitResolution } from "./dama-skill-action-resolver.types";
import { SkillHitResolverInput } from "./skill-hit-resolver.types";
import { CriticalDamageResolverService } from "./critical-damage-resolver.service";
import { DamageCalculatorService } from "../damage-calculator.service";
import { DamageResolverService } from "./damage-resolver.service";

@Injectable()
export class SkillHitResolver {
    constructor(
        private criticalDamageResolverService: CriticalDamageResolverService,
        private damageCalculatorService: DamageCalculatorService,
        private damageResolverService: DamageResolverService

    ) { }

    resolveHit({
        attacker,
        buffDamageMultiplier,
        dmgMultiplierPerHit,
        hitIndex,
        preparedDamage,
        skill,
        skillDamageMultiplier,
        contextualBonusDamageMultiplier,
        target
    }: SkillHitResolverInput): DamageHitResolution {
        const criticalResult = this.criticalDamageResolverService.resolve(attacker)

        const components: DamageComponentResolution[] = [];

        let totalBaseDamage = 0;
        let totalModifiedDamage = 0;
        let totalMitigatedDamage = 0;
        let totalAppliedDamage = 0;

        for (const component of preparedDamage.components) {
            if (!target.isAlive()) {
                break;
            }
            const baseDamage = this.damageCalculatorService.rollPreparedComponentDamage(component)

            const modifiedDamage = Math.max(0, Math.floor(
                baseDamage *
                dmgMultiplierPerHit *
                skillDamageMultiplier *
                contextualBonusDamageMultiplier *
                buffDamageMultiplier *
                criticalResult.multiplier
            ))

            const damageResult = this.damageResolverService.resolve({
                sourceType: 'skill',
                attacker,
                target,
                damage: modifiedDamage,
                damageType: component.damageType,
                skill
            })

            components.push({
                appliedDamage: damageResult.effectiveDamage,
                baseDamage,
                componentIndex: component.componentIndex,
                damageType: component.damageType,
                hitIndex: hitIndex,
                hpAfter: damageResult.hpAfter,
                hpBefore: damageResult.hpBefore,
                mitigatedDamage: damageResult.mitigatedAmount,
                modifiedDamage
            })

            totalBaseDamage += baseDamage;

            totalModifiedDamage += modifiedDamage;

            totalMitigatedDamage += damageResult.mitigatedAmount;

            totalAppliedDamage += damageResult.effectiveDamage;
        }

        /**
         * Registrar en la estadisticas
         */

        return {
            components,
            hitIndex,
            totalAppliedDamage,
            totalBaseDamage,
            totalModifiedDamage,
            totalMitigatedDamage
        }
    }
}