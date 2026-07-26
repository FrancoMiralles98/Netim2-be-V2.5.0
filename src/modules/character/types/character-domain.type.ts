import { SkillDamageEntity } from "src/modules/skill/entities/skill-damage.entity";
import { BaseCharacterProps } from "./baseCharacterProps/base-character-props.type";
import { Inventory } from "src/modules/inventory/entities/inventory.entity";
import { SkillAuraEntity } from "src/modules/skill/entities/skill-aura.entity";
import { SkillBuffEntity } from "src/modules/skill/entities/skill-buff.entity";

export interface CharacterDomain extends BaseCharacterProps {
hab: (SkillDamageEntity | SkillAuraEntity | SkillBuffEntity)[];
inventario: Inventory
}