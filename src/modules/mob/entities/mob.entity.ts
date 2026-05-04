import { randomIntInRange } from "src/modules/shared/functions/random-number-in-range.function";
import { MobType } from "../types/mobProps/mob.type";

export class Mob {
    constructor(private props: MobType) { }

    generateYangToDrop(): number {
        return randomIntInRange(this.props.yang.min, this.props.yang.max)
    }

    generateExpToDrop(): number {
        return randomIntInRange(this.props.exp.min, this.props.exp.max)
    }
}
