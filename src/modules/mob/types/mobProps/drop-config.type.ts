import { IdItemList } from "src/modules/item/types/iditems/id-item-list.type"

/**
 * Configuración completa del sistema de drops de un mob.
 *
 * @property quantity - Cantidad total de ítems que puede dropear el mob.
 *
 * @property specific_drop - Drop específico del mob
 *
 * @property generic_drop - Lista de drops genéricos organizados por rareza.
 *
 * @property drops_chance - Probabilidades de aparición para cada categoría de drop.
 */
export interface DropConfig {
    quantity: number;
    specific_drop: SpecificDrop;
    generic_drop: GenericDrop;
    drops_chance: DropsChance
}


/**
 * Representa un drop específico del mob.
 *
 * Extiende `DropDescription` agregando la probabilidad individual
 * de que este ítem sea dropeado.
 *
 * @property chances - Probabilidad de drop de este ítem específico.
 */
export interface SpecificDrop extends DropDescription {
    chances: number
}

/**
 * Describe un ítem que puede ser dropeado.
 *
 * @property idItem - Identificador del ítem.
 *
 * @property upgradeMax - Rango de mejora posible del ítem (si aplica).
 *
 * @property cantidad - Rango de cantidad del ítem que puede dropearse.
 */
export interface DropDescription {
    idItem:IdItemList,
    upgradeMax?:{min:number, max: number},
    cantidad?:{min:number, max: number}
}


/**
 * Lista de drops genéricos organizados por rareza.
 *
 * Cada categoría contiene posibles ítems que pueden ser seleccionados
 * según la probabilidad definida en `DropsChance`
 * Importante; la suma de las chances en cada categoria tiene que dar 100.
 */
export interface GenericDrop {
    comun: DropDescription[],
    poco_comun: DropDescription[],
    raro:DropDescription[]
}


/**
 * Probabilidades de aparición de cada categoría de drop.
 *
 * Los valores suelen representar porcentajes
 * utilizados en el sistema de selección de drops.
 */
export interface DropsChance {
    comun: number;
    poco_comun: number
    raro: number
}