import { DamageType, StatusEffectsKeys, UNIQUE_ID_SKILLS } from "netim2-shared";
import { DamageDelivery } from "../statistics/damage-statistics.types";
import { FightEventBase } from "./resource/fight-event-base.types";
import { FightResult } from "../fight/fight.type";
import { CombatStatModifier } from "../activeAura/active-aura.type";
import { CombatAction } from "../combatAction/combat-action.types";
import { HitResolutionSnapshot } from "./resource/hit-resolution-snapshot.types";
import { CombatDamageSource } from "./resource/combat-damage-resource.types";

export interface DamageResolutionSnapshot {
    damageType: DamageType;
    delivery: DamageDelivery;

    /**
     * Daño antes de bonificaciones ofensivas.
     */
    rawDamage: number;

    /**
     * Daño después de bonificaciones, damageModifiers,
     * críticos y otros multiplicadores.
     */
    modifiedDamage: number;

    mitigatedByDefense: number;
    mitigatedByBlock: number;
    mitigatedByResistance: number;

    /**
     * Suma de todas las mitigaciones.
     */
    totalMitigated: number;

    /**
     * Daño resultante antes de limitarlo por el HP restante.
     */
    finalDamage: number;

    /**
     * Daño que efectivamente perdió el objetivo.
     */
    appliedDamage: number;

    overkillDamage: number;
}

export interface HealingResolutionSnapshot {
    rawHealing: number;

    bonusHealing: number;

    critical: boolean;

    /**
     * Curación después de bonus y crítico,
     * pero antes de las reducciones.
     */
    modifiedHealing: number;

    reducedByHealingReduction: number;
    reducedByPoison: number;

    totalPrevented: number;

    /**
     * Curación resultante antes de limitarla
     * por el HP faltante.
     */
    finalHealing: number;

    /**
     * HP efectivamente recuperado.
     */
    appliedHealing: number;

    overhealing: number;
}

export interface StatusEffectSnapshot {
    instanceId: string;
    effectId: StatusEffectsKeys;

    sourceFighterId: string;
    targetFighterId: string;

    remainingTurns: number;

    stacks?: {
        current: number;
        toApplyExtraDamage: number;
    };

    damagePerTick?: number;
}

export interface FightStartedEvent
    extends FightEventBase<'fight_started'> {
    fighterIds: string[];
    turnOrder: string[];
}

export interface FightFinishedEvent
    extends FightEventBase<'fight_finished'> {
    result: FightResult;
}

export interface TurnStartedEvent
    extends FightEventBase<'turn_started'> {
    actorId: string;
}

export interface TurnSkippedEvent
    extends FightEventBase<'turn_skipped'> {
    actorId: string;
}

export interface TurnEndedEvent
    extends FightEventBase<'turn_ended'> {
    actorId: string;

    actorAlive: boolean;

    actorCurrentHp: number;
    actorCurrentMana: number;
}

export type FighterResourceType =
    | 'hp'
    | 'mana';

export type ResourceChangeReason =
    | 'hp_regeneration'
    | 'mana_regeneration'
    | 'mana_spent'
    | 'mana_restored'
    | 'mana_drained'
    | 'aura_upkeep';

export interface ResourceChangedEvent
    extends FightEventBase<'resource_changed'> {
    fighterId: string;

    resource: FighterResourceType;
    reason: ResourceChangeReason;

    previousValue: number;
    currentValue: number;

    /**
     * Siempre positivo.
     */
    amount: number;
}

export interface CooldownUpdatedEvent
    extends FightEventBase<'cooldown_updated'> {
    fighterId: string;
    skillId: UNIQUE_ID_SKILLS;

    previousRemainingTurns: number;
    remainingTurns: number;
}

export interface AuraActivatedEvent
    extends FightEventBase<'aura_activated'> {
    fighterId: string;

    auraInstanceId: string;
    skillId: UNIQUE_ID_SKILLS;

    appliedModifiers: readonly CombatStatModifier[];

    remainingTurns?: number;
}

export interface AuraUpkeepPaidEvent
    extends FightEventBase<'aura_upkeep_paid'> {
    fighterId: string;

    auraInstanceId: string;
    skillId: UNIQUE_ID_SKILLS;

    manaSpent: number;
    remainingMana: number;
}

export interface AuraDurationUpdatedEvent
    extends FightEventBase<'aura_duration_updated'> {
    fighterId: string;

    auraInstanceId: string;
    skillId: UNIQUE_ID_SKILLS;

    previousRemainingTurns: number;
    remainingTurns: number;
}

export interface AuraDeactivatedEvent
    extends FightEventBase<'aura_deactivated'> {
    fighterId: string;

    auraInstanceId: string;
    skillId: UNIQUE_ID_SKILLS;

}

export interface BuffAppliedEvent
    extends FightEventBase<'buff_applied'> {
    sourceFighterId: string;
    targetFighterId: string;

    buffInstanceId: string;
    skillId: UNIQUE_ID_SKILLS;

    remainingTurns?: number;
}

export interface BuffConsumedEvent
    extends FightEventBase<'buff_consumed'> {
    fighterId: string;

    buffInstanceId: string;
    skillId: UNIQUE_ID_SKILLS;

    reason:
    | 'skill_used'
    | 'successful_hit'
    | 'damage_dealt';

    remainingUses: number;
}

export interface BuffDurationUpdatedEvent
    extends FightEventBase<'buff_duration_updated'> {
    fighterId: string;

    buffInstanceId: string;
    skillId: UNIQUE_ID_SKILLS;

    previousRemainingTurns: number;
    remainingTurns: number;
}

export interface BuffDeactivatedEvent
    extends FightEventBase<'buff_deactivated'> {
    fighterId: string;

    buffInstanceId: string;
    skillId: UNIQUE_ID_SKILLS;

    reason:
    | 'duration_expired'
    | 'uses_consumed'
    | 'source_defeated'
    | 'removed'
    | 'replaced';
}

export interface ActionSelectedEvent
    extends FightEventBase<'action_selected'> {
    actorId: string;
    action: CombatAction;
}

export interface BasicAttackUsedEvent
    extends FightEventBase<'basic_attack_used'> {
    attackerId: string;
    targetId: string;
}

export interface SkillUsedEvent
    extends FightEventBase<'skill_used'> {
    casterId: string;

    skillId: UNIQUE_ID_SKILLS;

    targetIds: string[];

    manaSpent: number;
}


export interface DoubleHitTriggeredEvent
    extends FightEventBase<'double_hit_triggered'> {
    attackerId: string;
    targetId: string;

    generatedHitCount: number;
}

export interface HitResolvedEvent
    extends FightEventBase<'hit_resolved'> {
    attackerId: string;
    targetId: string;

    source:
    | {
        type: 'basic_attack';
    }
    | {
        type: 'skill';
        skillId: UNIQUE_ID_SKILLS;
        componentIndex?: number;
    };

    /**
     * Empieza desde 0.
     */
    hitIndex: number;

    resolution: HitResolutionSnapshot;
}

export interface DamageResolvedEvent
    extends FightEventBase<'damage_resolved'> {
    source: CombatDamageSource;

    targetFighterId: string;

    skillId?: UNIQUE_ID_SKILLS;
    componentIndex?: number;
    hitIndex?: number;

    critical: boolean;
    penetrating: boolean;

    resolution: DamageResolutionSnapshot;

    targetPreviousHp: number;
    targetCurrentHp: number;

    targetDefeated: boolean;
}


export type HealingSource =
    | {
        type: 'skill';
        skillId: UNIQUE_ID_SKILLS;
    }
    | {
        type: 'life_steal';
    }
    | {
        type: 'spell_vampirism';
        skillId: UNIQUE_ID_SKILLS;
    }
    | {
        type: 'regeneration';
    };


export interface HealingResolvedEvent
    extends FightEventBase<'healing_resolved'> {
    sourceFighterId: string;
    targetFighterId: string;

    source: HealingSource;

    resolution: HealingResolutionSnapshot;

    targetPreviousHp: number;
    targetCurrentHp: number;
}

export interface StatusEffectApplicationAttemptedEvent
    extends FightEventBase<'status_effect_application_attempted'> {
    sourceFighterId: string;
    targetFighterId: string;

    skillId?: UNIQUE_ID_SKILLS;

    effectId: StatusEffectsKeys;

    applicationChance: number;
    resistanceChance: number;
}

export interface StatusEffectAppliedEvent
    extends FightEventBase<'status_effect_applied'> {
    effect: StatusEffectSnapshot;

    skillId?: UNIQUE_ID_SKILLS;
}

export interface StatusEffectResistedEvent
    extends FightEventBase<'status_effect_resisted'> {
    sourceFighterId: string;
    targetFighterId: string;

    skillId?: UNIQUE_ID_SKILLS;

    effectId: StatusEffectsKeys;

    resistanceChance: number;
}

export type StatusEffectUpdateType =
    | 'duration_accumulated'
    | 'duration_refreshed'
    | 'damage_replaced'
    | 'damage_kept'
    | 'stack_added'
    | 'stack_triggered';

export interface StatusEffectUpdatedEvent
    extends FightEventBase<'status_effect_updated'> {
    effectInstanceId: string;
    effectId: StatusEffectsKeys;

    targetFighterId: string;

    updateType: StatusEffectUpdateType;

    previous: StatusEffectSnapshot;
    current: StatusEffectSnapshot;
}

export interface StatusEffectTickedEvent
    extends FightEventBase<'status_effect_ticked'> {
    effectInstanceId: string;
    effectId: StatusEffectsKeys;

    sourceFighterId: string;
    targetFighterId: string;

    tickNumber: number;

    appliedDamage: number;

    remainingTurns: number;
}

export interface StatusEffectDurationUpdatedEvent
    extends FightEventBase<'status_effect_duration_updated'> {
    effectInstanceId: string;
    effectId: StatusEffectsKeys;

    targetFighterId: string;

    previousRemainingTurns: number;
    remainingTurns: number;
}

export type StatusEffectDeactivationReason =
    | 'duration_expired'
    | 'cleansed'
    | 'removed'
    | 'replaced'
    | 'source_defeated'
    | 'target_defeated';

export interface StatusEffectDeactivatedEvent
    extends FightEventBase<'status_effect_deactivated'> {
    effectInstanceId: string;
    effectId: StatusEffectsKeys;

    targetFighterId: string;

    reason: StatusEffectDeactivationReason;
}


export interface ControlEffectProcessedEvent
    extends FightEventBase<'control_effect_processed'> {
    fighterId: string;

    effectInstanceId: string;
    effectId: StatusEffectsKeys;

    controlType: 'stun';

    preventedAction: boolean;

    remainingTurns: number;
    expired: boolean;
}

export type FighterDefeatCause =
    | {
        type: 'basic_attack';
        sourceFighterId: string;
    }
    | {
        type: 'skill';
        sourceFighterId: string;
        skillId: UNIQUE_ID_SKILLS;
    }
    | {
        type: 'status_effect';
        sourceFighterId: string;
        effectId: StatusEffectsKeys;
    }
    | {
        type: 'reflected';
        sourceFighterId: string;
    };

export interface FighterDefeatedEvent
    extends FightEventBase<'fighter_defeated'> {
    fighterId: string;

    cause: FighterDefeatCause;
}

export type FightEvent =
    // Pelea y turnos
    | FightStartedEvent
    | TurnStartedEvent
    | TurnSkippedEvent
    | TurnEndedEvent
    | FightFinishedEvent

    // Recursos y cooldowns
    | ResourceChangedEvent
    | CooldownUpdatedEvent

    // Auras
    | AuraActivatedEvent
    | AuraUpkeepPaidEvent
    | AuraDurationUpdatedEvent
    | AuraDeactivatedEvent

    // Buffs
    | BuffAppliedEvent
    | BuffConsumedEvent
    | BuffDurationUpdatedEvent
    | BuffDeactivatedEvent

    // Acciones
    | ActionSelectedEvent
    | BasicAttackUsedEvent
    | SkillUsedEvent

    // Golpes y daño
    | DoubleHitTriggeredEvent
    | HitResolvedEvent
    | DamageResolvedEvent

    // Curación
    | HealingResolvedEvent

    // Estados
    | StatusEffectApplicationAttemptedEvent
    | StatusEffectAppliedEvent
    | StatusEffectResistedEvent
    | StatusEffectUpdatedEvent
    | StatusEffectTickedEvent
    | StatusEffectDurationUpdatedEvent
    | StatusEffectDeactivatedEvent
    | ControlEffectProcessedEvent

    // Derrotas
    | FighterDefeatedEvent;


