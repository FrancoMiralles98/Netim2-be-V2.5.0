import { SkillBonusDamage } from "src/modules/skill/types/props/damage-skill.type";

export type ActionAttackerType =
    SkillDmgDescriptionType |
    BasicAttackDescriptionType |
    HealingDescriptionType


export interface SkillDmgDescriptionType {
    type_action: 'skill',
    idSkill: number;
    type_damage: 'ad' | 'ap'
    cd: number;
    bonus_damage?: SkillBonusDamage;
    dmg: number;
    effectsChances: {
        veneno: boolean;
        incendio: boolean;
        sangrado: boolean;
        critico: boolean;
        desmayo: boolean;
        retardo: boolean;
        penetracion_habilidad: number
    },
    potentialSkill?: {
        idSkill: number;
        cd: number;
        dmgBonificated: number;
        bonusToAdd: number;
    }
}

export interface BasicAttackDescriptionType {
    type_action: 'basic_attack'
    dmg: number;
    missHit: boolean;
    doble_golpe: boolean;
    effectsChances: {
        veneno: boolean;
        incendio: boolean;
        sangrado: boolean;
        critico: boolean;
        desmayo: boolean;
        penetracion: boolean;
        retardo: boolean;
        
    }
}


export interface HealingDescriptionType {
    type_action: 'healing'
    healing: number;
    idSkill: number;
    cd: number
}