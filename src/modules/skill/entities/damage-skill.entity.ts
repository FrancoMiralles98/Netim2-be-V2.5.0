import { DamageSkillType } from "../types/props/damage-skill.type";
import { BaseSkillEntity } from "./skill-base.entity";

export class DamageSkillEntity extends BaseSkillEntity<DamageSkillType> {
    constructor(props: DamageSkillType) {
        super(props)
    }

    toPrimitives(): DamageSkillType {
        return structuredClone({
            ...this.props
        })
    }
}