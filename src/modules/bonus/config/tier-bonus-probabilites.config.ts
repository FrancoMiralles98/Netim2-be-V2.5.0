import { BonusTierLv } from "../types/bonusListHelper/bonus.type";

/**
 * Probabilidades de aparición de cada tier de bonus genérico.
 *
 * Define la distribución de rareza para los tiers de bonus al momento de generarlos
 * Cada clave representa un nivel de tier, y su valor indica la probabilidad de ser seleccionado
 *
 * @note :
 * - Se utilizan en sistemas de roll acumulativo asi que las probabilidades deben sumar 100.
 *
 */
export const TIER_BONUS_PROBABILITIES: Record<BonusTierLv,number> = {
    1: 50,
    2: 35,
    3: 14,
    4: 1
}