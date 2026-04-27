import { BaseSkill } from "src/modules/skill/types/base-skill.type";
import { BaseCharacterProps } from "./baseCharacterProps/base-character-props.type";
import { Inventory } from "src/modules/inventory/entities/inventory.entity";
import { SkillEntity } from "src/modules/skill/entities/skill-base.entity";

export interface CharacterDomain extends BaseCharacterProps {
hab: SkillEntity[];
inventario: Inventory
}