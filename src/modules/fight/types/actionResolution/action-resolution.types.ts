import { UNIQUE_ID_SKILLS } from "netim2-shared";
import { CombatAction } from "../combatAction/combat-action.types";
import { TurnContext } from "../fight/fight-context.types";
import { AppliedStatusEffectResolution, DamageHitResolution } from "../../services/resolvers/dama-skill-action-resolver.types";
import { HealingResolution } from "../../services/resolvers/healing-resolver.types";
import { DamageResolutionResult } from "../../services/resolvers/damage-resolver.types";
import { ActiveStatusEffectId } from "../statusEffects/active-status-effect.types";

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
    remainingMana: number;

    hpAfter: number;
    hpBefore: number;
    cooldownRemainingTurns: number

    appliedHealing: number;

    preventedHealing: number;

    critical: boolean;
}

export interface DamageSkillActionResolution
    extends ActionResolutionBase<'use_damage_skill'> {
    targetId: string;
    skillId: UNIQUE_ID_SKILLS;

    manaSpent: number;
    remainingMana: number;

    cooldownRemainingTurns: number;

    lifeSteal: HealingResolution
    reflectedDmgResult: DamageResolutionResult | null 

    hitCount: number;
    hits: DamageHitResolution[];

    totalBaseDamage: number;
    totalModifiedDamage: number;
    totalMitigatedDamage: number;
    totalAppliedDamage: number;

    statusEffects: AppliedStatusEffectResolution[];

    targetDefeated: boolean;
}

export interface BasicAttackActionResolution
    extends ActionResolutionBase<'basic_attack'> {
    targetId: string;

    totalDamageApplied: number;

    extraAttackTriggered: boolean;

    hitCount: number;

    lifeSteal: HealingResolution
    reflectedDmgResult: DamageResolutionResult | null

    hits: BasicAttackHitResolution[];
    statusEffects: AppliedStatusEffectResolution[]

    targetDefeated: boolean;
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


export type BasicAttackHitOutcome =
    | 'missed'
    | 'dodged'
    | 'blocked'
    | 'applied';

export interface BasicAttackHitResolution {
    hitIndex: number;

    outcome: BasicAttackHitOutcome;

    missChance: number;
    dodgeChance: number;
    blockChance: number;

    missed: boolean;
    dodged: boolean;
    blocked: boolean;

    critical: boolean;
    criticalMultiplier: number;

    penetration: boolean;

    baseDamage: number;

    /**
     * Daño después de bonus ofensivos y crítico,
     * antes de defensa.
     */
    modifiedDamage: number;

    mitigatedDamage: number;
    appliedDamage: number;
    overkillDamage: number;

    hpBefore: number;
    hpAfter: number;
}


export interface PeriodicStatusEffectResolution {
    effectId: ActiveStatusEffectId;

    instanceId: string;

    sourceFighterId: string;
    targetFighterId: string;

    tickNumber: number;

    tickDamage: DamageResolutionResult;

    stackProc?: {
        procCount: number;

        consumedStacks: number;
        remainingStacks: number;

        damagePerProc: number;

        totalRequestedDamage: number;

        damage: DamageResolutionResult;
    };

    totalAppliedDamage: number;

    targetDefeated: boolean;
}

export interface PeriodicDamageApplicationResult {
    requestedDamage: number;

    mitigatedDamage: number;

    damageAfterMitigation: number;

    appliedDamage: number;

    overkillDamage: number;

    hpBefore: number;
    hpAfter: number;
}