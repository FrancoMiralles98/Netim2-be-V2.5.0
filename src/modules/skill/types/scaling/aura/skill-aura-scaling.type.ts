import { BonusRefKeys, CombatStatModifierOperation, RoutStatKey, SkillCooldownConfig } from "netim2-shared";
import { EscaladoAtributos } from "../escalado-atributos-types";
import { SkillScalingLv } from "../escalado-lv.types";

export interface SkillAuraScaling {
    type: 'aura';
    escaladoAtributos: EscaladoAtributos;
    escaladoStatsModifiers: EscaladoStatsModifiers[];
    mana: {
        base: number;
        perLv: number;
    },
    cd: SkillCooldownConfig,
    duration?: {
        base: number;
        perLv: number;
    }
}

export interface EscaladoStatsModifiers {
    target: RoutStatKey;
    bonusRefKey: BonusRefKeys;
    operation: CombatStatModifierOperation;
    escalado: EscaladoStat
}

export interface EscaladoStat {
    escaladoLv: SkillScalingLv;
    base: number;
    scaleWithAttribute: boolean;
}