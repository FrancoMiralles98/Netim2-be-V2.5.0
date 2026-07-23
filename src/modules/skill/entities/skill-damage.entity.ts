import { SkillDamage } from "netim2-shared";
import { BaseSkillEntity } from "./skill-base.entity";
import { SkillDamageSummary } from "../types/summary-skills.types";

export class SkillDamageEntity extends BaseSkillEntity<SkillDamage> {
    constructor(props: SkillDamage) {
        super(props)
    }

    toPrimitives() {
        return structuredClone(this.props)
    }

    static summaryToSkillType(summary: SkillDamageSummary): SkillDamage {
        return {
            ...summary,
            lv: 1,
            components: [],
            cd: {},
            nombre: '',
        }
    }

}