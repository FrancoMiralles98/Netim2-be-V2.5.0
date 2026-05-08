import { AuraSkillEntity } from "../entities/aura-skill.entity";
import { DamageSkillEntity } from "../entities/damage-skill.entity";
import {  AuraSkillType } from "../types/aura-skill.type";
import {  DamageSkillType } from "../types/damage-skill.type";
import { SkillEntity } from "../types/skill-entity.type";

export class SkillFactory {
    static create(skill: DamageSkillType | AuraSkillType): SkillEntity {
        switch (skill.type) {
            case 'Aura':
                return new AuraSkillEntity(skill as AuraSkillType)
            case 'Daño': 
                return new DamageSkillEntity(skill as DamageSkillType)
            default:
                throw new Error('No se pudo identificar el tipo de skill')
        }
    }
}