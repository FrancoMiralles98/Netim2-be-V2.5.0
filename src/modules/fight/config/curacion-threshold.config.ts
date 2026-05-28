/**
 * Porcentaje mínimo de HP requerido para permitir el uso de habilidades de curación.
 *
 * Si el porcentaje de vida actual del luchador es mayor o igual a este valor,
 * las habilidades de curación no serán utilizadas.
 *
 * Se aplica esta limitacion para evitar curaciones innecesarias
 */
export const CURACION_THRESHLOD = 60