import { BaseCharacterProps } from "./baseCharacterProps/base-character-props.type";
import { Inventory } from "src/modules/inventory/entities/inventory.entity";
import { DamageSkillEntity } from "src/modules/skill/entities/damage-skill.entity";
import { AuraSkillEntity } from "src/modules/skill/entities/aura-skill.entity";

export interface CharacterDomain extends BaseCharacterProps {
hab: (DamageSkillEntity | AuraSkillEntity)[];
inventario: Inventory
}