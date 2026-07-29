import { StatusEffectsKeys } from "netim2-shared";

export interface ProcessedControlEffect {
    effectInstanceId: string;
    effectId: StatusEffectsKeys;

    preventedAction: boolean;

    remainingTurns?: number;
    expired: boolean;
}

export interface ControlEffectProcessorResult {
    canAct: boolean;
    processedEffects: ProcessedControlEffect[];
}