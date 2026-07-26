import { SkillType } from "netim2-shared";
import { SkillSummary } from "../types/summary-skills.types";
import { SkillAuraEntity } from "../entities/skill-aura.entity";
import { SkillBuffEntity } from "../entities/skill-buff.entity";
import { SkillDamageEntity } from "../entities/skill-damage.entity";

export class SkillMapper {
    static summaryToSkill(skillSummary: SkillSummary): SkillType {
        switch (skillSummary.type) {
            case "aura":
                return SkillAuraEntity.summaryToSkillType(skillSummary)
            case "buff":
                return SkillBuffEntity.summaryToSkillType(skillSummary)
            case "heal":
            case "damage":
                return SkillDamageEntity.summaryToSkillType(skillSummary)
            default:
                throw new Error('No se puedo obtener la informacion de las skill')
        }
    }
}