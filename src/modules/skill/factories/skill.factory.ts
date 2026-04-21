import { AuraSkillEntity } from "../entities/aura-skill.entity";
import { DamageSkillEntity } from "../entities/damage-skill.entity";
import { AuraSkill } from "../types/aura-skill.type";
import { DamageSkill } from "../types/damage-skill.type";
import { SkillEntity } from "../types/skill-entity.type";

export class SkillFactory {
    static create(skill: DamageSkill | AuraSkill): SkillEntity {
        switch (skill.tipo) {
            case 'Aura':
                return new AuraSkillEntity(skill as AuraSkill)
            case 'Daño': 
                return new DamageSkillEntity(skill as DamageSkill)
            default:
                throw new Error('No se pudo identificar el tipo de skill')
        }
    }
}