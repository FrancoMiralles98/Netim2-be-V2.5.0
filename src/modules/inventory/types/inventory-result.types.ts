import { InventoryItem } from "./inventory-item.type"
import { ItemToUpdate } from "./item-to-update.types"

export type AddItemResult = {
    newItems: InventoryItem[],
    updatedItems: ItemToUpdate[]
}