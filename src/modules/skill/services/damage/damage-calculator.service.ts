import { Injectable } from "@nestjs/common";
import { SharedSkillService } from "../shared-skill.service";
import { CharacterStats, DamageType, SkillDamage, SkillDamageScaling, SkillDamageStatScaling } from "netim2-shared";
import { CharacterSharedService } from "src/modules/shared/services/character-shared.service";

@Injectable()
export class DamageCalculatorService {
    constructor(
        private sharedSkillService: SharedSkillService,
        private sharedCharacterService: CharacterSharedService,
    ) { }
    getDamage(
        skill: SkillDamage,
        scaling: SkillDamageScaling,
        stats: CharacterStats
    ): SkillDamage['components'] {
        return scaling.components.map(component => {
            const ranges = this.getRangesDamage(component.damageType, stats)
            const statsBonusDamage = this.calculateStatScalingBonus(skill, stats, component.statsScaling)
            const attributeBonification = this.sharedSkillService.getAttributeBonification(stats.atributos, component.escaladoAtributos!)

            return {
                damageType: component.damageType,
                range: {
                    min: Math.trunc((ranges.min + statsBonusDamage) * attributeBonification),
                    max: Math.trunc((ranges.max + statsBonusDamage) * attributeBonification),
                },
                tags: component.tags,
                flags: component.flags,
                statsScaling: [],
            }
        })
    }

    private getRangesDamage(
        damageType: DamageType,
        stats: CharacterStats
    ): { min: number, max: number } {
        if (damageType === 'true') {
            return { min: 0, max: 0 }
        }
        const minRange = damageType === 'ad'
            ? stats.general.ad.min
            : stats.general.ap.min

        const maxRange = damageType === 'ad'
            ? stats.general.ad.max
            : stats.general.ap.max

        return {
            max: maxRange,
            min: minRange
        }
    }

    private calculateStatScalingBonus(
        skill: SkillDamage,
        stats: CharacterStats,
        statsScaling?: SkillDamageStatScaling[],
    ): number {
        if (!statsScaling) return 0
        let bonusDamage = 0
        const pointsLv = this.sharedSkillService.getPointsLvBonification(skill.lv)
        for (const statInfo of statsScaling) {
            const statInCharacter = this.sharedCharacterService.getCharacterStatValue(stats, statInfo.stat)
            if (typeof statInCharacter !== 'number') {
                continue;
            }
            const multiplier = statInfo.base + (pointsLv * statInfo.perLv)
            bonusDamage += Math.trunc(statInCharacter * multiplier)
        }

        return Math.max(0, bonusDamage)
    }
}