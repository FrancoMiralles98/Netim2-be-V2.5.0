import { ActiveStatusEffectId } from "../statusEffects/active-status-effect.types";

export interface EffectStatistics {
    appliedByType: Partial<
        Record<ActiveStatusEffectId, number>
    >;

    receivedByType: Partial<
        Record<ActiveStatusEffectId, number>
    >;

    //En caso de retardo y desmayo que podes evitar ese efecto, ese valor se acumula aca
    resistedByType: Partial<
        Record<ActiveStatusEffectId, number>
    >;
}