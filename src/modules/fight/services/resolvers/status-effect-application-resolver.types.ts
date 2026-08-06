import { DamageCondition, SkillDamage, StatsModifiers, StatsScaling, StatusEffectsKeys } from "netim2-shared";
import { CombatStatKey } from "../../types/activeAura/active-aura.type";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";

export interface StatusEffectDurationConfig {
    baseTurns: number;
    /**
     * Stat efectiva que aumenta la duración.
     */
    bonusTarget: CombatStatKey[];

    canStackDuration: boolean

    maxTurns?: number;
}

export interface PeriodicStatusEffectBaseConfig {
    type: 'periodic_damage';
    resistible: boolean;
    duration: StatusEffectDurationConfig;

    /**
     * Ratio del daño que aplicó el efecto.
     *
     * 0.13 representa 13 %.
     */
    baseDamageRatio: number;

    bonusDamageCondition?: {
        condition: DamageCondition,
        bonusDamageRatio: number
    };

    /**
     * Escalado con estadísticas efectivas del objetivo.
     */
    statsScaling?: StatsScaling[];

    /**
     * Bonificaciones porcentuales del atacante.
     */
    damageBonusTarget?: CombatStatKey[];

    statsModifiers?: StatsModifiers[];

    stacks?: {
        initial: number;
        max: number;
        toApplyExtraDamage: number;
    };
}

export interface PoisonStatusEffectConfig
    extends PeriodicStatusEffectBaseConfig {
    effectId: 'veneno';

    healReduction: number;
}

export interface FireStatusEffectConfig
    extends PeriodicStatusEffectBaseConfig {
    effectId: 'incendio';

    /**
     * Ratio adicional cuando se reaplica.
     *
     * 0.10 representa +10 %.
     */
    extraDamageRatioPerRefresh: number;
}

export interface BleedingStatusEffectConfig
    extends PeriodicStatusEffectBaseConfig {
    effectId: 'sangrado';

    /**
     * Daño agregado por cada punto de velocidad
     * de movimiento del objetivo.
     */
    damagePerMovementSpeedPoint: number;
}

export interface ElectricStatusEffectConfig
    extends PeriodicStatusEffectBaseConfig {
    effectId: 'electrico';

    /**
     * Ratio extra al alcanzar la cantidad
     * configurada de stacks.
     */
    extraDamageRatioPerStackThreshold: number;
}

export interface ControlStatusEffectConfig {
    type: 'control';
    resistible: boolean;
    duration: StatusEffectDurationConfig;

    statsModifiers?: StatsModifiers[];
}

export interface StatModifierStatusEffectConfig {
    type: 'stat_modifier';
    resistible: boolean;
    duration: StatusEffectDurationConfig;

    statsModifiers: StatsModifiers[];
}

export type PeriodicStatusEffectConfig =
    | PoisonStatusEffectConfig
    | FireStatusEffectConfig
    | BleedingStatusEffectConfig
    | ElectricStatusEffectConfig;


export type StatusEffectConfig =
    | PoisonStatusEffectConfig
    | FireStatusEffectConfig
    | BleedingStatusEffectConfig
    | ElectricStatusEffectConfig
    | ControlStatusEffectConfig
    | StatModifierStatusEffectConfig;

export interface ResolveSkillEffectsInput {
    source: FighterCombatEntity;
    target: FighterCombatEntity;
    triggeringDamage: number
    effect: Partial<Record<StatusEffectsKeys, number>> | undefined;

    appliedOnTurn: number;

}

export interface StatusEffectApplicationResult {
    effectId: StatusEffectsKeys;

    applied: boolean;
    resisted: boolean;

    baseChance: number;

    instanceId?: string;

    remainingTurns?: number;
    resistanceChance?: number;

    stacks?: number;
}