/**
 * Probabilidad de esquivar ataques básicos aportada por cada punto de VM total.
 *
 * El valor se expresa en puntos porcentuales, no como una fracción de 0 a 1.
 * Aporte de esquiva (%) = Math.max(0, vm) * DODGE_CHANCE_PER_MOVEMENT_SPEED.
 * Este aporte se combina con otros bonus de esquiva antes de aplicar sus límites.
 *
 * @example 100 puntos de VM aportan 30% de probabilidad de esquivar ataques básicos.
 */
export const DODGE_CHANCE_PER_MOVEMENT_SPEED = 0.3;

/**
 * Probabilidad de esquivar hechizos aportada por cada punto de VM total.
 *
 * Equivale a la mitad del aporte de VM a la esquiva de ataques básicos.
 * Aporte de esquiva (%) = Math.max(0, vm) * SPELL_DODGE_CHANCE_PER_MOVEMENT_SPEED.
 * La proporción se aplica al aporte de VM, no a otros bonus de esquiva.
 *
 * @example 100 puntos de VM aportan 15% de probabilidad de esquivar hechizos.
 */
export const SPELL_DODGE_CHANCE_PER_MOVEMENT_SPEED = DODGE_CHANCE_PER_MOVEMENT_SPEED / 2;

/**
 * Conversión de velocidad de hechizo en reducción de enfriamiento con rendimientos decrecientes.
 *
 * La pendiente empieza en initialReductionPerPoint y decae exponencialmente
 * según decayRate, hasta acercarse a una pendiente lineal menor.
 * La curva se normaliza para alcanzar maxReductionPercent en maxReductionPoints.
 * enfriamiento = enfriamientoBase * (1 - reducción / 100).
 *
 * La curva es creciente y cada punto aporta menos reducción hasta llegar al límite.
 * Los valores negativos de VH se interpretan como 0; superar el umbral no aumenta la reducción.
 *
 * @property {number} maxReductionPercent - Límite de reducción de enfriamiento, expresado en porcentaje.
 * @property {number} initialReductionPerPoint - Reducción porcentual por punto de VH al inicio.
 * @property {number} decayRate - Rapidez con la que disminuye el aporte inicial de VH.
 * @property {number} maxReductionPoints - Puntos de VH necesarios para alcanzar la reducción máxima.
 *
 * @example Con 100 puntos de VH, la reducción es ~39,63%; con 300 o más puntos, 80%.
 */
export const CAST_SPEED_COOLDOWN_SCALING_CONFIG = {
    maxReductionPercent: 80,
    initialReductionPerPoint: 1,
    decayRate: 0.04,
    maxReductionPoints: 300,
} as const;

