import { AuraSkill } from "../types/aura-skill.type";
import { BaseSkillEntity } from "./skill-base.entity";

export class AuraSkillEntity extends BaseSkillEntity<AuraSkill> {
    constructor(props: AuraSkill) {
        super(props)
    }
}