import { BonusDefensaRefKeys } from "src/modules/bonus/types/bonusListHelper/ref-bonus-name.type";

export interface BasicAttackDefenseDescriptionType {
    dmgToReduce: number;
    defensiveChance: defensiveChance
}

export type defensiveChance = Record<
Extract<BonusDefensaRefKeys,'bloquear_ataques' | 'esquivar_ataques' | 'corta_curacion' | 'reflectar'>,
boolean>


export interface SkillDefenseDescriptionType {
    dmgToReduce: number;
    defensiveChance: {
        corta_curacion: boolean
    }
}