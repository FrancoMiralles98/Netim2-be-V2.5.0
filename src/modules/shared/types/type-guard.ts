import { InventoryItem } from "src/modules/inventory/types/inventory-item.type";
import { ItemDTO, UtilityItemDTO } from "src/modules/item/types/item-dto";

/**
 * @description - un type guard para tener una forma de descriminar items de equipo con items 
 * de utilidad, principalmente de manera generica para tener las props base de los items de utilidad
 */
export const isUtilityItem =(item: ItemDTO | InventoryItem): item is UtilityItemDTO => {
    return item.type === 'utility'
}