import { Skill } from "src/modules/skill/types/skill.type";
import { BaseCharacterProps } from "./baseCharacterProps/base-character-props.type";
import { InventoryItem } from "src/modules/inventory/types/inventory-item.type";

export interface CharacterPersistence extends BaseCharacterProps {
    hab: Skill[]
    inventario: InventoryItem[]
}