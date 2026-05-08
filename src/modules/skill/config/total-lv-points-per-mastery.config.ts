/**
 * Cantidad total de puntos efectivos que representa
 * cada rango de maestría de una habilidad.
 *
 * Estos valores se utilizan para transformar
 * rangos de maestría (`M`, `G`, `P`) en puntos
 * equivalentes para los cálculos de daño y escalado.
 *
 * Ejemplo:
 * - `M1` = 17 puntos efectivos
 * - `G5` = 31 puntos efectivos
 * - `P` = 37 puntos efectivos
 */
export const TOTAL_LV_POINTS_PER_MASTERY_CONFIG = {
    'M': 16,
    'G': 26,
    'P': 37,
}