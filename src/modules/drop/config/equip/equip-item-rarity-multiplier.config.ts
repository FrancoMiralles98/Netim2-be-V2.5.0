import { ItemBonusQuality } from "src/modules/bonus/types/item-bonus-quaility.type"

/**
 * Multiplicadores utilizados por el bonus de frecuencia de objetos raros de ítems.
 *
 * Estos valores determinan cuánto aumenta el peso de aparición de las
 * calidades más raras cuando el jugador posee bonus de frecuencia
 * de objetos raros.
 *
 * El efecto se aplica de forma progresiva según el valor del bonus:
 *
 * ```txt
 * Frecuencia rara = 0%
 * → No se aplica ningún incremento.
 *
 * Frecuencia rara = 50%
 * → Se aplica el 50% del multiplicador configurado.
 *
 * Frecuencia rara = 100%
 * → Se aplica el multiplicador completo.
 */

export const RARE_QUALITY_MULTIPLIER: Partial<Record<ItemBonusQuality, number>> = {
    rare: 1.3,
    epic: 1.8,
    unique: 2.5,
}

export const RARE_BONUS_QUANTITY_MULTIPLIER: Partial<Record<0 | 1 | 2 | 3 | 4 | 5, number>> = {
    3: 1.3,
    4: 1.8,
    5: 2.5,
}