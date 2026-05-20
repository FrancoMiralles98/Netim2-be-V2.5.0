import { BonusDefensaRefKeys } from "src/modules/bonus/types/bonusListHelper/ref-bonus-name.type";

export type ActionDefenderType = BasicAttackDefenseDescriptionType | SkillDefenseDescriptionType

export interface BasicAttackDefenseDescriptionType {
    dmgToReceive: number;
    defensiveChance: defensiveChance
}

export type defensiveChance = Record<
Extract<BonusDefensaRefKeys,'bloquear_ataques' | 'esquivar_ataques' | 'corta_curacion' | 'reflectar'>,
boolean>


export interface SkillDefenseDescriptionType {
    dmgToReceive: number;
    defensiveChance: {
        corta_curacion: boolean
    }
}