import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CharacterRace, CharacterSpeciality, SkillBuff, SkillBuffScaling } from "netim2-shared";
import { SharedSkillService } from "../shared-skill.service";
import { isSkillBuffScaling } from "../../types/skills.guards";

@Injectable()
export class BuffSkillService {
    constructor(
        private sharedSkillService: SharedSkillService,
    ) { }

    getUpdatedSkill(
        skill: SkillBuff,
        race: CharacterRace,
        speciality: CharacterSpeciality
    ): SkillBuff {
        const scalingSkillInfo = this.sharedSkillService.getSkillScalingInfo(skill.id, race, speciality)
        if (!isSkillBuffScaling(scalingSkillInfo)) {
            throw new InternalServerErrorException(`La skill ${skill.id} no posee una configuración de escalado de buffo válida`)
        }
        return this.buildUpdatedSkill(skill, scalingSkillInfo)
    }

    buildUpdatedSkill(skill: SkillBuff, scaling: SkillBuffScaling): SkillBuff {
        return {
            ...skill,
            cd: scaling.cd,
            mana: this.sharedSkillService.getManaCost(skill.mana, scaling, skill.lv),
            effects: this.calculateBuffEffect(skill, scaling)
        }
    }


    private calculateBuffEffect(skill: SkillBuff, scaling: SkillBuffScaling,): SkillBuff['effects'] {
        const lvMultiplier = this.sharedSkillService.getScalingLvValue(skill.lv, scaling.multiplier.escaladoLv)
        const lvPoints = this.sharedSkillService.getPointsLvBonification(skill.lv)
        return skill.effects.map(effect => {
            return {
                ...effect,
                multiplier: scaling.multiplier.base + (scaling.multiplier.escaladoLv.perLv * lvPoints * lvMultiplier)
            }
        })
    }
}