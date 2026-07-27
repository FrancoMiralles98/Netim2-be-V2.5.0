import { StatusEffectsKeys } from "netim2-shared";

export interface EffectStatistics {
    appliedByType: Partial<
        Record<StatusEffectsKeys, number>
    >;

    receivedByType: Partial<
        Record<StatusEffectsKeys, number>
    >;

    //En caso de retardo y desmayo que podes evitar ese efecto, ese valor se acumula aca
    resistedByType: Partial<
        Record<StatusEffectsKeys, number>
    >;
}