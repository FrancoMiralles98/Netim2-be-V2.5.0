import { SkillType } from "netim2-shared";
import { InventoryItem } from "src/modules/inventory/types/inventory-item.type";
import { BaseCharacterProps } from "./baseCharacterProps/base-character-props.type";

export interface CharacterPersistence extends BaseCharacterProps {
    hab: SkillType[]
    inventario: InventoryItem[]
}