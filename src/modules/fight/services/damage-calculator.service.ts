import { Injectable } from "@nestjs/common";
import { FighterCombatEntity } from "../entities/fighter-combat.entity";
import { SkillDamage, SkillDamageComponents, StatsScaling } from "netim2-shared";
import { PreparedSkillDamage, PreparedSkillDamageComponent, RuntimeDamageScalingDetail, RuntimeDamageScalingResult } from "./damage-calculator.types";
import { RngService } from "src/modules/shared/services/rng.service";

@Injectable()
export class DamageCalculatorService {
    constructor(
        private rngService: RngService
    ) { }

    rollPreparedComponentDamage(component: PreparedSkillDamageComponent): number {
        const { adjustedRange } = component.runtimeScaling;

        return this.rngService.randomNumberInRange(adjustedRange.min,adjustedRange.max)
    }

    prepareSkillDamage(attacker: FighterCombatEntity, skill: SkillDamage): PreparedSkillDamage {
        const components = skill.components.map((component, index): PreparedSkillDamageComponent => {
            return {
                componentIndex: index,
                damageType: component.damageType,
                tags: [...component.tags],
                flags: component.flags,
                runtimeScaling: this.calculateRunTimeScaling(attacker, component)
            }
        })

        return {
            skillId: skill.id,
            components
        }
    }

    private calculateRunTimeScaling(
        attacker: FighterCombatEntity,
        component: SkillDamageComponents
    ): RuntimeDamageScalingResult {
        const originalRange = {
            min: component.range.min,
            max: component.range.max
        }

        const scalingDetails = this.calculateScalingDetails(attacker, component.statsScaling)

        const totalDamageAdjustment = scalingDetails.reduce((total, detail) => {
            return (total + detail.damageAdjustment)
        }, 0)

        const adjustedRange = {
            min: Math.max(0, Math.floor(originalRange.min + totalDamageAdjustment)),
            max: Math.max(0, Math.floor(originalRange.max + totalDamageAdjustment))
        }

        return {
            adjustedRange,
            originalRange,
            scalingDetails,
            totalDamageAdjustment
        }

    }

    private calculateScalingDetails(
        attacker: FighterCombatEntity,
        statsScaling: StatsScaling[] | undefined
    ): RuntimeDamageScalingDetail[] {
        if (!statsScaling?.length) {
            return [];
        }

        return statsScaling.map(scaling => {
            const baseValue = attacker.getBaseStatValue(scaling.target)
            const effectiveValue = attacker.getEffectiveStatValue(scaling.target)

            const statDifference = effectiveValue - baseValue

            const damageAdjustment = statDifference * scaling.ratio;

            return {
                baseValue,
                damageAdjustment,
                effectiveValue,
                statDifference,
                target: scaling.target,
                ratio: scaling.ratio,
                stat: scaling.stat,
            }
        })
    }

}