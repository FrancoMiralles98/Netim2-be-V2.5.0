import { DropWeightType } from "netim2-shared/dist/drop/drop-weight.type";

/**
 * Pesos utilizados por el sistema de selección de drops.
 *
 * Cada valor representa la frecuencia relativa con la que un ítem
 * puede ser seleccionado dentro de un pool de drops.
 *
 * Estos valores no representan porcentajes directos, sino pesos
 * comparativos entre los distintos ítems candidatos.
 *
 * Esta configuración es utilizada por el sistema de drops para
 * seleccionar un ítem concreto una vez determinado el pool de
 * candidatos disponibles.
 */
export const DROP_WEIGHT:Record<DropWeightType,number> = {
    VERY_COMMON: 1000,
    COMMON: 500,
    UNCOMMON: 150,
    RARE: 40,
    VERY_RARE: 10,
    ULTRA_RARE: 1,
}
