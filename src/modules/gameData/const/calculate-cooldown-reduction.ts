import { CAST_SPEED_COOLDOWN_SCALING_CONFIG } from './bonus.const';

/** Curva con pendiente inicial configurable, aporte decreciente y límite exacto. */
export const calculateCooldownReductionPercent = (castSpeed: number): number => {
    const {
        maxReductionPercent,
        initialReductionPerPoint,
        decayRate,
        maxReductionPoints,
    } = CAST_SPEED_COOLDOWN_SCALING_CONFIG;

    if (!Number.isFinite(castSpeed) || castSpeed <= 0) return 0;
    if (castSpeed >= maxReductionPoints) return maxReductionPercent;

    const exponentialAtMax = -Math.expm1(-decayRate * maxReductionPoints) / decayRate;
    const linearSlope = (maxReductionPercent - initialReductionPerPoint * exponentialAtMax)
        / (maxReductionPoints - exponentialAtMax);
    const exponentialContribution = -Math.expm1(-decayRate * castSpeed) / decayRate;

    return linearSlope * castSpeed
        + (initialReductionPerPoint - linearSlope) * exponentialContribution;
};
