import { SkillAura } from "netim2-shared";
import { BaseSkillEntity } from "./skill-base.entity";
import { SkillAuraSummary } from "../types/summary-skills.types";

export class SkillAuraEntity extends BaseSkillEntity<SkillAura> {
    constructor(props: SkillAura) {
        super(props)
    }
    
    toPrimitives() {
        return structuredClone(this.props)
    }

    static summaryToSkillType (summary:SkillAuraSummary): SkillAura {
        return {
            ...summary,
            lv: 1,
            statsModifiers: [],
            cd: {},
            nombre: '',
        }
    }
}