import { EquipType, InventoryItem, ItemDTO, MonturaType, PiedraType, UtilityItemDTO } from "netim2-shared"


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