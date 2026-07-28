import { StatusEffectsKeys } from "netim2-shared";
import { ActiveStatusEffectData, BleedingEffectData, ElectricEffectData, FireEffectData, PoisonEffectData } from "../../types/statusEffects/effect-data.types";
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

export function isPeriodicDamageEffectData(data: ActiveStatusEffectData
): data is PeriodicEffect {
    return 'damagePerTick' in data;
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