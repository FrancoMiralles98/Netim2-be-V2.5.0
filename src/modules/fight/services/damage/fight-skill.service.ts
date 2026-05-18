import { Injectable } from "@nestjs/common";
import { SkillDamageInFight } from "../../types/entites/fight-details.type";
import { SkillType } from "src/modules/skill/types/const/skill.type";
import { HealingDescriptionType, SkillDmgDescriptionType } from "../../types/services/damage-description.type";
import { FightStats } from "../../types/entites/fight-stats.type";
import { CURACION_THRESHLOD } from "../../config/curacion-threshold.config";
import { UNIQUE_ID_SKILLS } from "src/modules/skill/types/props/unique-id-skill.enum";
import { randomNumberInRange } from "src/modules/shared/functions/random-number-in-range.function";
import { DamageSkillType } from "src/modules/skill/types/props/damage-skill.type";

@Injectable()
export class FightSkillService {

    tryToSelectSkillDmg(
        skillsCanUse: SkillDamageInFight[],
        skillsStats: SkillType[],
        stats: FightStats
    ): SkillDmgDescriptionType | HealingDescriptionType | false {

        const availableSkill = skillsCanUse.find(skill => {

            //Se especifica que camulaje no pase porque esta skill se usa en combinacion con otra y se valida despues
            if (!skill.isLearned || skill.cdSkill > 0 || skill.idSkill === UNIQUE_ID_SKILLS.CAMUFLAJE) {
                return false
            }

            //Si es curacion se verifica que si tiene sentido que se usa la habilidad
            if (skill.idSkill === UNIQUE_ID_SKILLS.CURACION) {
                return this.needCuracionSkill(stats) ? skill : false
            }

            return true
        })

        if (!availableSkill) {
            return false
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

        return this.getSkillInfoToUse(skillInfo, skillsCanUse)
    }

    private getSkillInfoToUse(
        skillInfo: DamageSkillType,
        skillsCanUse: SkillDamageInFight[]
    ): SkillDmgDescriptionType {

        return {
            dmg: randomNumberInRange(skillInfo.daño.min, skillInfo.daño.max),
            effectsChances: {
                desmayo: skillInfo.bonus_efecto.desmayo,
                incendio: skillInfo.bonus_efecto.incendio,
                veneno: skillInfo.bonus_efecto.veneno,
                retardo: skillInfo.bonus_efecto.retardo,
                sangrado: skillInfo.bonus_efecto.sangrado,
                penetracion_habilidad: skillInfo.bonus_efecto.penetracion_habilidad,
            },
            cd: skillInfo.cd,
            bonus_damage: skillInfo.bonus_damage ? skillInfo.bonus_damage : undefined,
            idSkill: skillInfo.idSkill,
            type_action: 'skill',
            potentialSkill: this.canUseStealth(skillsCanUse)
        }
    }


    private needCuracionSkill(stats: FightStats): boolean {
        const hpPlayer = stats.general.hp
        return hpPlayer.actual * 100 / hpPlayer.max <= CURACION_THRESHLOD
    }



    private canUseStealth(
        skillsCanUse: SkillDamageInFight[]
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
            return {
                idSkill: availableSkill.idSkill,
                dmgBonificated: 0
            }
        }

        return undefined
    }
}