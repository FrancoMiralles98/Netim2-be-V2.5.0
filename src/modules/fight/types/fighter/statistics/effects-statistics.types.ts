import { StatusEffectsKeys } from "netim2-shared";

export interface EffectStatistics {
    appliedByType: Partial<
        Record<StatusEffectsKeys, number>
    >;

    receivedByType: Partial<
        Record<StatusEffectsKeys, number>
    >;

    resistedByType: Partial<
        Record<StatusEffectsKeys, number>
    >;
}