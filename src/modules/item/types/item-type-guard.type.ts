import { InventoryItem } from "src/modules/inventory/types/inventory-item.type";
import { ItemDTO, UtilityItemDTO } from "./item-dto";
import { EquipType } from "./entities-props/equip.type";
import { PiedraType } from "./entities-props/piedra.type";
import { MonturaType } from "./entities-props/montura.type";

export const isUtilityItem = (item: InventoryItem | ItemDTO): item is UtilityItemDTO => {
    return item.type === 'utility' && 'cantidad' in item
}

export const isEquipItem = (item: InventoryItem | ItemDTO): item is EquipType => {
    return item.type === 'equip' && 'sub_type_equip' in item
}

export const isPiedraItem = (item: InventoryItem | ItemDTO): item is PiedraType => {
    return item.type === 'utility' && 'upgradeLv' in item
}

export const isMonturaItem = (item: InventoryItem | ItemDTO): item is MonturaType => {
    return item.type === 'utility' && 'montura' in item
}