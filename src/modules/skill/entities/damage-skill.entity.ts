import { DamageSkill } from "../types/damage-skill.type";
import { BaseSkillEntity } from "./skill-base.entity";

export class DamageSkillEntity extends BaseSkillEntity<DamageSkill> {
    constructor(props: DamageSkill) {
        super(props)
    }
}