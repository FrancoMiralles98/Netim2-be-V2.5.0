import { SkillDamageEntity } from "src/modules/skill/entities/skill-damage.entity";
import { SkillAuraEntity } from "src/modules/skill/entities/skill-aura.entity";
import { SkillBuffEntity } from "src/modules/skill/entities/skill-buff.entity";
import { BaseCharacterProps } from "netim2-shared";
import { Inventory } from "src/modules/inventory/entities/inventory.entity";

export interface CharacterDomain extends BaseCharacterProps {
hab: (SkillDamageEntity | SkillAuraEntity | SkillBuffEntity)[];
inventario: Inventory
}