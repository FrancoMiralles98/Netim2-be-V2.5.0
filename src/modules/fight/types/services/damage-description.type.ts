import { SkillBonusDamage } from "src/modules/skill/types/props/damage-skill.type";

export type ActionAttackerType =
    SkillDmgDescriptionType |
    BasicAttackDescriptionType |
    HealingDescriptionType


export interface SkillDmgDescriptionType {
    type_action: 'skill',
    idSkill: number;
    cd: number;
    bonus_damage?: SkillBonusDamage;
    dmg: number;
    effectsChances: {
        veneno: number;
        incendio: number;
        sangrado: number;
        desmayo: number;
        retardo: number;
        penetracion_habilidad: number
    },
    potentialSkill?: {
        idSkill: number;
        dmgBonificated: number;
    }
}

export interface BasicAttackDescriptionType {
    type_action: 'basic_attack'
    dmg: number;
    effectsChances: {
        veneno: number;
        incendio: number;
        sangrado: number;
        desmayo: number;
        retardo: number;
        doble_golpe: number;
    }
}


export interface HealingDescriptionType {
    type_action: 'healing'
    healing: number;
    idSkill: number;
    cd: number
}