import { StatusEffectsKeys } from "netim2-shared";
import { ActiveStatusEffectData, BleedingEffectData, DesmayoEffectData, ElectricEffectData, FireEffectData, PeriodicDamageEffectData, PoisonEffectData, RetardoEffectData } from "../../types/statusEffects/effect-data.types";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";
import { ActiveStatusEffectEntity } from "../../entities/active-status-effect.entity";

export interface PeriodicEffectProcessorResult {
    ticks: PeriodicEffectTickResult[];
    totalDamageReceived: number;
    actorDefeated: boolean;
}
export interface PeriodicEffectTickResult {
    effectInstanceId: string;
    effectId: StatusEffectsKeys;

    sourceFighterId: string;
    targetFighterId: string;

    rawDamage: number;
    mitigatedDamage: number;
    finalDamage: number;
    appliedDamage: number;

    remainingTurns: number;
    expired: boolean;
}

export type PeriodicEffect = PoisonEffectData | FireEffectData | BleedingEffectData | ElectricEffectData
export type ControlEffect = DesmayoEffectData
export type TimedStatModifier = RetardoEffectData

export function isPeriodicDamageEffectData(data: ActiveStatusEffectData
): data is PeriodicEffect {
    return 'damagePerTick' in data;
}

export function isControlDamageEffectData(data: ActiveStatusEffectData
): data is ControlEffect {
    return data.effectId === 'desmayo'
}

export function isTimedStatModifierEffectData(data: ActiveStatusEffectData
): data is TimedStatModifier {
    return data.effectId === 'retardo'
}

export function hasStackExtraDamage(data: PeriodicDamageEffectData): data is ElectricEffectData {
    return data.effectId === 'electrico';
}



export interface PeriodicEffectTickResult {
    effectInstanceId: string;
    effectId: StatusEffectsKeys;

    sourceFighterId: string;
    targetFighterId: string;

    rawDamage: number;
    mitigatedDamage: number;
    finalDamage: number;
    appliedDamage: number;

    remainingTurns: number;
    expired: boolean;
}

export interface DeactivateStatusEffectInput {
    owner: FighterCombatEntity;
    effect: ActiveStatusEffectEntity;
}