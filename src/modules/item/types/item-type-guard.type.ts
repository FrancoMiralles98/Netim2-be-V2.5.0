import { InventoryItem } from "src/modules/inventory/types/inventory-item.type";
import { ItemDTO, UtilityItemDTO } from "./item-dto";

export const isUtilityItem = (item: InventoryItem | ItemDTO):item is UtilityItemDTO => {
    return item.type === 'utility' && 'cantidad' in item
}