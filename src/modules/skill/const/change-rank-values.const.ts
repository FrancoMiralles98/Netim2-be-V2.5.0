
/**
 * Define la transición automática entre rangos de mastery de una skill.
 *
 * @description
 * Cuando una skill alcanza el nivel máximo de un rango,
 * pasa automáticamente al siguiente rango:
 *
 * - Nivel 16 → M1 (inicio de Master)
 * - M10 → G1 (inicio de Grand Master)
 * - G10 → P (Perfect)
 *
 * Esta constante representa únicamente los puntos de cambio
 * entre rangos avanzados.
 *
 * @example
 * CHANGE_MASTERY_RANK_LV_VALUES['M10'] → 'G1'
 * CHANGE_MASTERY_RANK_LV_VALUES['G10'] → 'P'
 *
 * @note
 * Solo se incluyen los niveles que generan un cambio de rango,
 * no los incrementos internos (ej: M1 → M2).
 */
export const CHANGE_MASTERY_RANK_LV_VALUES = {
    'M10':'G1',
    'G10':'P'
} as const