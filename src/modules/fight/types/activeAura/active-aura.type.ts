import { BonusCCRefKeys, BonusDañoRefKeys, BonusDefensaRefKeys, BonusMiscsRefKeys, BonusGeneralRefKeys, SkillAura, UNIQUE_ID_SKILLS } from "netim2-shared";
import { ActiveStatusEffectId } from "../statusEffects/active-status-effect.types";

export interface CreateActiveAuraProps {
    instanceId: string;

    skill: SkillAura;

    sourceFighterId: string;

    activatedOnTurn: number;

    appliedModifiers: CombatStatModifier[];
}

export interface CombatStatModifier {
    id: string;

    source: CombatStatModifierSource;

    target: CombatStatKey; //a que stat apunta el aura 

    operation: CombatStatModifierOperation;

    value: number;
}

export type CombatStatKey =
    | `general.${BonusGeneralRefKeys}`
    | `bonus.daño.${BonusDañoRefKeys}`
    | `bonus.defensa.${BonusDefensaRefKeys}`
    | `bonus.cc.${BonusCCRefKeys}`
    | `bonus.miscs.${BonusMiscsRefKeys}`;

/**
 * flat       Suma o resta una cantidad fija
 * increased  Aumento porcentual acumulativo
 * reduced    Reducción porcentual acumulativa
 */
export type CombatStatModifierOperation =
    | 'flat'
    | 'increased'
    | 'reduced'

export type CombatStatModifierSource =
    | AuraStatModifierSource
    | BuffStatModifierSource
    | StatusEffectStatModifierSource;


export interface AuraStatModifierSource {
    type: 'aura';

    instanceId: string;

    skillId: UNIQUE_ID_SKILLS;
}
export interface BuffStatModifierSource {
    type: 'buff';

    instanceId: string;

    skillId: UNIQUE_ID_SKILLS;
}
export interface StatusEffectStatModifierSource {
    type: 'status_effect';

    instanceId: string;

    effectId: ActiveStatusEffectId;

    sourceFighterId: string;
}