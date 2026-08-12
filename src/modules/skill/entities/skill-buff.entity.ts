import { SkillBuff } from "netim2-shared";
import { BaseSkillEntity } from "./skill-base.entity";
import { SkillBuffSummary } from "../types/summary-skills.types";

export class SkillBuffEntity extends BaseSkillEntity<SkillBuff> {
    constructor(props: SkillBuff) {
        super(props)
    }

    toPrimitives() {
        return structuredClone(this.props)
    }

    static summaryToSkillType(summary: SkillBuffSummary): SkillBuff {
        return {
            stats: [],
            duration: {turns:0,type:'turns'},
            ...summary,
            lv: 1,
            effects: [],
            cd: {},
            nombre: '',
        }
    }
}