import { DropWeightType } from "../../types/drop-weight.type";

/**
 * Multiplicadores utilizados por el bonus de frecuencia de objetos raros.
 *
 * Estos valores determinan cuánto aumenta el peso de selección
 * de un ítem cuando el jugador posee bonus de frecuencia de drops raros.
 *
 * El multiplicador se aplica progresivamente según el valor del bonus:
 *
 * ```txt
 * rareBonusValue = 0
 * → no aplica ningún efecto
 *
 * rareBonusValue = 50
 * → aplica el 50% del efecto configurado
 *
 * rareBonusValue = 100
 * → aplica el 100% del efecto configurado

 * Los drops comunes (`VERY_COMMON` y `COMMON`) no son afectados
 * por este sistema para evitar incrementar la frecuencia de objetos
 * de bajo valor.
 */
export const RARE_DROP_MULTIPLIER: Partial<Record<DropWeightType, number>> = {
    UNCOMMON: 1.2,
    RARE: 1.5,
    VERY_RARE: 2,
    ULTRA_RARE: 3,
}