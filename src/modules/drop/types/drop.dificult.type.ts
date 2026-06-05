
/**
 * Configuración que define el comportamiento del sistema de drops
 * para una combinación específica de tipo de enemigo y dificultad.
 *
 * Controla:
 * - La cantidad de intentos de drop realizados.
 * - Las probabilidades de cada resultado posible por intento.
 * - El bonus de nivel aplicado a los equipamientos generados.

 */
export interface DropDifficultyConfig {
    attempts: { min: number, max: number },
    resultChances: {
        nothing: number,
        yang: number,
        item: number
    },
    bonusItemLv: { min: number, max: number },
}