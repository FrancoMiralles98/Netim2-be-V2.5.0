import { Injectable } from "@nestjs/common";
import { SkillDamageInFight } from "../../types/entites/fight-details.type";
import { SkillType } from "src/modules/skill/types/const/skill.type";
import { HealingDescriptionType, SkillDmgDescriptionType } from "../../types/services/damage-description.type";
import { FightStats } from "../../types/entites/fight-stats.type";
import { CURACION_THRESHLOD } from "../../config/curacion-threshold.config";
import { UNIQUE_ID_SKILLS } from "src/modules/skill/types/props/unique-id-skill.enum";
import { ChanceBonusDamage, DamageSkillType, SkillBonusDamage, TierBonusDamage } from "src/modules/skill/types/props/damage-skill.type";
import { FighterType } from "../../types/entites/fight-entity.type";
import { RngService } from "src/modules/shared/services/rng.service";

@Injectable()
export class FightSkillService {

    constructor(
        private rngService: RngService
    ){}

    tryToSelectSkill(
        skillsCanUse: SkillDamageInFight[],
        skillsStats: SkillType[],
        stats: FightStats
    ): SkillDmgDescriptionType | HealingDescriptionType | null {

        const availableSkill = skillsCanUse.find(skill => {

            //Se especifica que camulaje no pase porque esta skill se usa en combinacion con otra y se valida despues
            if (!skill.isLearned || skill.cdSkill > 0 || skill.idSkill === UNIQUE_ID_SKILLS.CAMUFLAJE) {
                return null
            }

            //Si es curacion se verifica que si tiene sentido que se usa la habilidad
            if (skill.idSkill === UNIQUE_ID_SKILLS.CURACION) {
                return this.needCuracionSkill(stats) ? skill : null
            }

            return true
        })

        if (!availableSkill) {
            return null
        }

        const skillInfo = skillsStats.find(skill => skill.idSkill === availableSkill.idSkill)
        if (!skillInfo) {
            throw new Error('Error al encontrar la skill seleccionada')
        }

        if (skillInfo.type === 'Aura') {
            throw new Error(`La skill ${skillInfo.idSkill} seleccionada no puede ser de tipo Aura`)
        }

        if (availableSkill.idSkill === UNIQUE_ID_SKILLS.CURACION) {
            return {
                type_action: 'healing',
                healing: 0,
                idSkill: availableSkill.idSkill,
                cd: skillInfo.cd
            }
        }

        return this.getSkillInfoToUse(skillInfo, skillsCanUse,skillsStats,stats)
    }

    applyBonus(
        skillToUse:SkillDmgDescriptionType,
        attacker: FighterType,
        defender: FighterType
    ):SkillDmgDescriptionType {

        const skillUpdated = {...skillToUse}

        let totalBonus = 0

        totalBonus += attacker.stats.bonus.daño[defender.raza] || 0
        totalBonus += attacker.stats.bonus.daño[defender.target_type] || 0
        totalBonus += attacker.stats.bonus.daño.habilidad

        if (skillUpdated.potentialSkill) {
            totalBonus += skillUpdated.potentialSkill.bonusToAdd
        }

        skillUpdated.dmg = Math.round(skillUpdated.dmg + (skillUpdated.dmg * (totalBonus / 100)))

        if (skillToUse.bonus_damage) {
            skillUpdated.dmg *= this.getBonusDamage(skillToUse.bonus_damage)
        }

        if (skillUpdated.effectsChances.critico) {
            skillUpdated.dmg *= attacker.stats.bonus.daño.daño_critico / 100
        }

        return skillUpdated
    }

    private getBonusDamage(bonusDamage: SkillBonusDamage ): number {
        return bonusDamage.type === 'chance'
        ? this.calculateChanceBonusDamage(bonusDamage)
        : this.calculateTierBonusDamage(bonusDamage)
    }

    private calculateTierBonusDamage(tierBonusDamage: TierBonusDamage ): number {
        const randomNumber = this.rngService.randomNumberInRange()
        
        let acc = 0
        let bonification = 1

        for (const bonusDamage of Object.values(tierBonusDamage) as Array<{ chance: number, multi: number }>) {
            if (!bonusDamage) {
                continue
            }

            acc += bonusDamage.chance

            if (randomNumber <= acc) {
                bonification = bonusDamage.multi
                break
            }
        }

        return bonification
    }

    private calculateChanceBonusDamage(chanceBonusDamage: ChanceBonusDamage): number {
        return this.rngService.rollChance(chanceBonusDamage.value) ? chanceBonusDamage.multi : 1
    }

    private getSkillInfoToUse(
        skillInfo: DamageSkillType,
        skillsCanUse: SkillDamageInFight[],
        allSkills: SkillType[],
        stats: FightStats
    ): SkillDmgDescriptionType {

        return {
            dmg: this.rngService.randomNumberInRange(skillInfo.daño.min, skillInfo.daño.max),
            effectsChances: {
                desmayo: this.rngService.rollChance(skillInfo.bonus_efecto.desmayo),
                incendio: this.rngService.rollChance(skillInfo.bonus_efecto.incendio),
                veneno: this.rngService.rollChance(skillInfo.bonus_efecto.veneno),
                retardo: this.rngService.rollChance(skillInfo.bonus_efecto.retardo),
                critico: this.rngService.rollChance(stats.bonus.daño.critico),
                sangrado: this.rngService.rollChance(skillInfo.bonus_efecto.sangrado),
                penetracion_habilidad: skillInfo.bonus_efecto.penetracion_habilidad,
            },
            cd: skillInfo.cd,
            bonus_damage: skillInfo.bonus_damage ? skillInfo.bonus_damage : undefined,
            idSkill: skillInfo.idSkill,
            type_action: 'skill',
            potentialSkill: this.canUsePotencialSkills(skillsCanUse,allSkills)
        }
    }


    private needCuracionSkill(stats: FightStats): boolean {
        const hpPlayer = stats.general.hp
        return hpPlayer.actual * 100 / hpPlayer.max <= CURACION_THRESHLOD
    }



    private canUsePotencialSkills(
        skillsCanUse: SkillDamageInFight[],
        skillsInfo: SkillType[]
    ): SkillDmgDescriptionType['potentialSkill'] {
        const availableSkill = skillsCanUse.find(skill => {

            if (!skill.isLearned || skill.cdSkill > 0) {
                return false
            }

            if (skill.idSkill === UNIQUE_ID_SKILLS.CAMUFLAJE) {
                return true
            }

            return false
        })

        if (availableSkill) {
            const dataOfSkill = skillsInfo.find(skill => skill.idSkill === availableSkill.idSkill) as DamageSkillType

            if (!dataOfSkill) {
                throw new Error (`No se encuentra el idSkill ${availableSkill.idSkill} en el pool de habs`)
            }

            return {
                idSkill: availableSkill.idSkill,
                dmgBonificated: 0,
                cd: dataOfSkill.cd,
                bonusToAdd: dataOfSkill.daño.max //da igual el .min o el .max porque los 2 valores son iguales
            }
        }

        return undefined
    }
}