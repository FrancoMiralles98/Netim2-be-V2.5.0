import { AuraSkillType } from "../types/props/aura-skill.type";
import { BaseSkillEntity } from "./skill-base.entity";

export class AuraSkillEntity extends BaseSkillEntity<AuraSkillType> {
    constructor(props: AuraSkillType) {
        super(props)
    }

    toPrimitives(): AuraSkillType {
        return structuredClone({
            ...this.props
        })
    }
}