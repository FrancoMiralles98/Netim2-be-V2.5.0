import { InventoryItem } from "src/modules/inventory/types/inventory-item.type";
import { ItemDTO, UtilityItemDTO } from "./item-dto";
import { EquipType } from "./entities-props/equip.type";

export const isUtilityItem = (item: InventoryItem | ItemDTO): item is UtilityItemDTO => {
    return item.type === 'utility' && 'cantidad' in item
}

export const isEquipItem = (item: InventoryItem | ItemDTO): item is EquipType => {
    return item.type === 'equip' && 'sub_type_equip' in item
}