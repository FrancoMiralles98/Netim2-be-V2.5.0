import { StatusEffectsKeys } from "netim2-shared";
import { ActiveStatusEffectId } from "../../types/statusEffects/active-status-effect.types";

export interface ProcessedControlEffect {
    effectInstanceId: string;
    effectId: ActiveStatusEffectId;

    preventedAction: boolean;

    remainingTurns?: number;
    expired: boolean;
}

export interface ControlEffectProcessorResult {
    canAct: boolean;
    processedEffects: ProcessedControlEffect[];
}