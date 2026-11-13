import { SkillType } from "netim2-shared";
import { SkillSummary } from "../types/summary-skills.types";
import { SkillAuraEntity } from "../entities/skill-aura.entity";
import { SkillBuffEntity } from "../entities/skill-buff.entity";
import { SkillDamageEntity } from "../entities/skill-damage.entity";
import { SkillHealEntity } from "../entities/skill-heal.entity";

export class SkillMapper {
    static summaryToSkill(skillSummary: SkillSummary, scaling: SkillType['escalado']): SkillType {
        if (skillSummary.type !== scaling.type) throw new Error(`El escalado no corresponde a la skill ${skillSummary.id}`);
        switch (skillSummary.type) {
            case "aura":
                if (scaling.type === 'aura') return SkillAuraEntity.summaryToSkillType(skillSummary, scaling)
                break
            case "buff":
                if (scaling.type === 'buff') return SkillBuffEntity.summaryToSkillType(skillSummary, scaling)
                break
            case "heal":
                if (scaling.type === 'heal') return SkillHealEntity.summaryToSkillType(skillSummary, scaling)
                break
            case "damage":
                if (scaling.type === 'damage') return SkillDamageEntity.summaryToSkillType(skillSummary, scaling)
                break
            default:
                throw new Error('No se puedo obtener la informacion de las skill')
        }
        throw new Error(`No se pudo obtener el escalado de la skill ${skillSummary.id}`)
    }
}
