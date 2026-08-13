import { SkillCooldownConfig } from "netim2-shared";
import { EscaladoStatsModifiers } from "../aura/skill-aura-scaling.type";
import { SkillScalingLv } from "../escalado-lv.types";

export interface SkillBuffScaling {
    type: 'buff',
    cd: SkillCooldownConfig,
    duration: {
        base: number;
        perLv: number;
    },
    uses: {
        base: number,
        perLv: number
    }
    mana: {
        base: number;
        perLv: number;
    },
    multiplier: {
        base: number;
        escaladoLv: SkillScalingLv
    },
    statsScaling: EscaladoStatsModifiers[]
}