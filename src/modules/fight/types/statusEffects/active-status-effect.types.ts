import { DurationConfig, StatusEffectsKeys } from "netim2-shared";
import { ActiveStatusEffectData } from "./effect-data.types";

export interface CreateActiveStatusEffectProps { 
    instanceId: string;
    effectId: StatusEffectsKeys;

    sourceFighterId: string;
    targetFighterId: string;

    appliedOnTurn: number;
    duration: DurationConfig;

    stacks?: {
        current: number;
        toApplyExtraDamage: number;
    };

    data: ActiveStatusEffectData;
}