import { Injectable } from "@nestjs/common";
import { SkillDamageInFightStats } from "../types/entites/fight-details.type";
import { UNIQUE_ID_SKILLS } from "src/modules/skill/types/props/unique-id-skill.enum";
import { CURACION_THRESHLOD } from "../config/curacion-threshold.config";
import { SkillType } from "src/modules/skill/types/const/skill.type";

@Injectable()
export class SkillService {

    totalSkillDmg () {

    }

    private calculateBasicSkillDmg(
        idSkillSelected: UNIQUE_ID_SKILLS,
        skillPoolDetails: SkillType[],
    ) {

    }

    shouldUseSkill(
        skillsInFight: SkillDamageInFightStats[],
        hp: {actual:number, max: number}
    ) {
        const skillToUse = skillsInFight.find(skill => skill.cdSkill === 0 && skill.isLearned)

        return skillToUse ? this.checkIfIsSpecificSkills(skillToUse,hp) : false
    }


    private checkIfIsSpecificSkills (
        skillSelected: SkillDamageInFightStats,
        hp: {actual:number, max: number}
    ) {
        if (skillSelected.idSkill === UNIQUE_ID_SKILLS.CURACION) {
            const porcentageHp = hp.actual * 100 / hp.max
            return porcentageHp <= CURACION_THRESHLOD
        }

        if (skillSelected.idSkill === UNIQUE_ID_SKILLS.CAMUFLAJE) {
            return false
        }
        return true
    }
}