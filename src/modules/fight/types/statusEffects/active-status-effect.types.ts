import { CombatStatModifier, DurationConfig, StatusEffectsKeys } from "netim2-shared";
import { ActiveStatusEffectData } from "./effect-data.types";

export interface CreateActiveStatusEffectProps {
    instanceId: string;
    effectId: ActiveStatusEffectId;

    sourceFighterId: string;
    targetFighterId: string;

    appliedOnTurn: number;
    lastAppliedOnTurn: number;
    duration: DurationConfig;

    stacks?: {
        current: number;
        toApplyExtraDamage: number;
    };

    statsModifier: CombatStatModifier[]

    data: ActiveStatusEffectData;
}

export type ActiveStatusEffectId = StatusEffectsKeys | 'corta_curacion'

export interface StatusEffectStackProcResult {
    triggered: boolean;

    procCount: number;

    consumedStacks: number;
    remainingStacks: number;
}