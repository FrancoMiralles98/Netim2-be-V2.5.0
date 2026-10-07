import { MasteryLvRank, SkillBase } from "netim2-shared";

export abstract class BaseSkillEntity<T extends SkillBase = SkillBase> {
    protected props: T

    constructor(props: T) {
        this.props = props
    }

    get idSkill(): number {
        return this.props.id
    }

    get lv(): number | MasteryLvRank {
        return this.props.lv
    }

}