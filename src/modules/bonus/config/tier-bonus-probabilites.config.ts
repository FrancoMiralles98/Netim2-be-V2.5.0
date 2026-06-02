import { ItemBonusQuality } from "src/modules/bonus/types/item-drop-quaility.type";
import { BonusTierLv } from "../types/bonusListHelper/bonus.type";

/**
 * Probabilidades de aparición de cada tier de bonus genérico segun la calidad.
 * 
 * @note esta calidad puede variar segun el conexto en que se este usando, si se en el drop
 * de un item de un mob hay chances de que pueda tener una calidad alta de bonus, si viene del
 * cambio con el Encantador siempre se tomara el valor 'normal'
 *
 * Define la distribución de rareza para los tiers de bonus al momento de generarlos
 * Cada clave representa un nivel de tier, y su valor indica la probabilidad de ser seleccionado
 *
 * @note :
 * - Se utilizan en sistemas de roll acumulativo asi que las probabilidades deben sumar 100.
 *
 */
export const TIER_BONUS_PROBABILITIES_X_QUALITY: Record<ItemBonusQuality, Record<BonusTierLv, number>> = {
    normal: {
        1: 55,
        2: 37,
        3: 7.5,
        4: 0.5
    },
    magic: {
        1: 45,
        2: 34,
        3: 20,
        4: 1
    },
    rare: {
        1: 35,
        2: 35,
        3: 25,
        4: 5
    },
    epic: {
        1: 20,
        2: 40,
        3: 30,
        4: 10
    },
    unique: {
        1: 5,
        2: 30,
        3: 45,
        4: 20
    }
}