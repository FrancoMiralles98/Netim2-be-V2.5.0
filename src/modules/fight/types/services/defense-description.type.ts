import { BonusDefensaRefKeys } from "src/modules/bonus/types/bonusListHelper/ref-bonus-name.type";

export type ActionDefenderType = BasicAttackDefenseDescriptionType | SkillDefenseDescriptionType

export interface BasicAttackDefenseDescriptionType {
    type_action: 'def_basic_attack'
    dmgToReceive: number;
    reflectar_dmg: number;
    defensiveChance: defensiveChance
}

export type defensiveChance = Record<
Extract<BonusDefensaRefKeys,'bloquear_ataques' | 'esquivar_ataques' | 'corta_curacion' | 'reflectar'>,
boolean>


export interface SkillDefenseDescriptionType {
    type_action: 'def_skill'
    dmgToReceive: number;
    reflectar_dmg: number;
    defensiveChance: {
        corta_curacion: boolean
    }
}