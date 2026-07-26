import { SkillType } from "netim2-shared"
import { SkillAuraEntity } from "../entities/skill-aura.entity"
import { SkillDamageEntity } from "../entities/skill-damage.entity"
import { SkillBuffEntity } from "../entities/skill-buff.entity"

export class SkillFactory {
    static create(skill: SkillType): SkillAuraEntity | SkillDamageEntity | SkillBuffEntity {
        switch (skill.type) {
            case 'aura':
                return new SkillAuraEntity(skill)
            case 'buff':
                return new SkillBuffEntity(skill)
            case 'damage':
                return new SkillDamageEntity(skill)
            default:
                throw new Error('No se pudo identificar el tipo de skill')
        }
    }
}