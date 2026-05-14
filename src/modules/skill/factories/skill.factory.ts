import { AuraSkillEntity } from "../entities/aura-skill.entity";
import { DamageSkillEntity } from "../entities/damage-skill.entity";
import {  AuraSkillType } from "../types/props/aura-skill.type";
import {  DamageSkillType } from "../types/props/damage-skill.type";
import { SkillEntity } from "../types/entity/skill-entity.type";

export class SkillFactory {
    static create(skill: DamageSkillType | AuraSkillType): SkillEntity {
        switch (skill.type) {
            case 'Aura':
                return new AuraSkillEntity(skill)
            case 'Daño': 
                return new DamageSkillEntity(skill)
            default:
                throw new Error('No se pudo identificar el tipo de skill')
        }
    }
}