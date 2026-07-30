import { UNIQUE_ID_SKILLS } from "netim2-shared";
import { CombatAction } from "../combatAction/combat-action.types";
import { TurnContext } from "../fight/fight-context.types";

export interface ResolveCombatActionInput {
    context: TurnContext;
    action: CombatAction;
}

export interface ResolveActionInput<
    TAction extends CombatAction
> {
    context: TurnContext;
    action: TAction;
}

export interface ActionResolutionBase<
    TType extends CombatAction['type']
> {
    type: TType;

    actorId: string;

    success: boolean;
}

export interface AuraActionResolution
    extends ActionResolutionBase<'cast_aura'> {
    skillId: UNIQUE_ID_SKILLS;
    auraInstanceId: string;
    manaSpent: number;
    remainingMana: number;
    cooldownRemainingTurns: number | undefined;
    remainingDuration?: number;

}

export interface BuffActionResolution
    extends ActionResolutionBase<'cast_buff'> {
    skillId: UNIQUE_ID_SKILLS;

    targetId: string;

    buffInstanceId: string;
    manaSpent: number;
    remainingMana: number;
    cooldownRemainingTurns: number | undefined;
    remainingDuration?: number;
    remainingUses: number;
}

export interface HealingSkillActionResolution
    extends ActionResolutionBase<'use_healing_skill'> {
    skillId: UNIQUE_ID_SKILLS;

    targetId: string;

    manaSpent: number;

    rawHealing: number;

    appliedHealing: number;

    preventedHealing: number;

    critical: boolean;
}

export interface DamageSkillActionResolution
    extends ActionResolutionBase<'use_damage_skill'> {
    skillId: UNIQUE_ID_SKILLS;

    targetId: string;

    manaSpent: number;

    totalDamageApplied: number;
}

export interface BasicAttackActionResolution
    extends ActionResolutionBase<'basic_attack'> {
    targetId: string;

    totalDamageApplied: number;

    doubleHitTriggered: boolean;
}

export interface SkipTurnActionResolution
    extends ActionResolutionBase<'skip_turn'> {
    reason:
    | 'no_valid_target'
    | 'no_available_action';
}

export type ActionResolution =
    | AuraActionResolution
    | BuffActionResolution
    | HealingSkillActionResolution
    | DamageSkillActionResolution
    | BasicAttackActionResolution
    | SkipTurnActionResolution;