import { Injectable } from "@nestjs/common";
import { UNIQUE_ID_SKILLS } from "../types/props/unique-id-skill.enum";
import { BONUS_DAMAGE_CONFIG } from "../config/specialSkills/bonus-damage.config";
import { ChanceBonusDamage, DamageSkillType, SkillBonusDamage, TierBonusDamage } from "../types/props/damage-skill.type";
import { ChanceDescription, TierBonusDamageDescription } from "../types/config/bonus-damage-config.type";
import { MasteryLvRank } from "../types/props/skill-lv-rank.types";
import { SharedSkillService } from "./shared-skill.service";
import { TIER_X_MASTERY_LV } from "../config/specialSkills/tier-x-master-lv.config";

@Injectable()
export class BonusDamageService {

    constructor(
        private sharedSkillService: SharedSkillService
    ) { }

    hasBonusDamage(idSkill: UNIQUE_ID_SKILLS): boolean {
        const bonusConfig = BONUS_DAMAGE_CONFIG[idSkill]

        return bonusConfig !== undefined
    }

    calculateBonusDamage(skill: DamageSkillType): SkillBonusDamage {
        const bonusConfig = BONUS_DAMAGE_CONFIG[skill.idSkill]
        const skillBonus = skill.bonus_damage

        if (!skillBonus || !bonusConfig) {
            throw new Error('No se encuentra la config de bonusDamage')
        }

        switch (bonusConfig.type) {
            case "chance":
                if (skillBonus.type !== 'chance') {
                    throw new Error(`${skill.idSkill} esperaba que bonusDamage tipo chance`)
                }
                return this.getChanceBonusDamage(skill.lv, bonusConfig)

            case "tier":
                if (skillBonus.type !== 'tier') {
                    throw new Error(`${skill.idSkill} esperaba que bonusDamage tipo tier`)
                }
                return this.getTierBonusDamage(skill.lv, bonusConfig)
            default:
                throw new Error(`Tipo de BonusDamage no soportado de ${skill.idSkill}`);
        }


    }

    private getChanceBonusDamage(
        lv: number | MasteryLvRank,
        config: ChanceDescription
    ): ChanceBonusDamage {
        const pointsLv = this.sharedSkillService.getPointsLvBonification(lv)

        const totalChance = config.baseChance + (pointsLv * config.chancePerLv)

        return {
            type: 'chance',
            value: totalChance,
            multi: config.multi
        }
    }

    private getTierBonusDamage(
        lv: MasteryLvRank | number,
        config: TierBonusDamageDescription
    ): TierBonusDamage {

        const tierLv = this.getTierByLv(lv)

        const tierConfig = config.tiers.find(c => c.tier === tierLv)

        if (!tierConfig) {
            throw new Error(`No se encuentra una configuracion de daño para de tier ${tierLv}`)
        }

        return {
            type: 'tier',
            value: tierConfig.damageConfig
        }
    }


    private getTierByLv(lv: number | MasteryLvRank): 1 | 2 | 3 | 4 {
        if (typeof lv === 'number') {
            return 1;
        }

        const { letterLv } = this.sharedSkillService.getLetterAndNumberOfMasteryLvRank(lv);

        return TIER_X_MASTERY_LV[letterLv];
    }
}