import { InventoryItem } from "./inventory-item.type"
import { InventoryChangeResult } from "./item-to-update.types"

/**
 * @description - tipo del return del metodo "AddItem"
 * @property {@link InventoryItem[]} newItems - Array donde se agrega los items nuevos agregados al inventario
 * @property {@link InventoryChangeResult[]} updatedItems - Array donde se agrega los items ya existentes 
 * en el inventario que se modificaron, es decir, se agrego cantidad al stack
 */
export type AddItemResult = {
    newItems: InventoryItem[],
    updatedItems: InventoryChangeResult[]
}