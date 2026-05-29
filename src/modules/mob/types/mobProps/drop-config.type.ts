import { IdItemList } from "src/modules/item/types/iditems/id-item-list.type"

/**
 * Representa un drop específico del mob.
 *
 * @property idItem - Identificador del ítem.
 * 
 * @property chances - Probabilidad de drop de este ítem específico.
 */
export interface SpecificDrop {
    chances: number
    idItem:IdItemList
}