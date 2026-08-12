import { SkillHeal } from "netim2-shared"
import { BaseSkillEntity } from "./skill-base.entity"
import { SkillHealSummary } from "../types/summary-skills.types"

export class SkillHealEntity extends BaseSkillEntity<SkillHeal> {
    constructor(props: SkillHeal) {
        super(props)
    }

    toPrimitives() {
        return structuredClone(this.props)
    }

    static summaryToSkillType(summary: SkillHealSummary): SkillHeal {
        return {
            components: [],
            ...summary,
            lv: 1,
            cd: {},
            nombre: '',
        }
    }
}