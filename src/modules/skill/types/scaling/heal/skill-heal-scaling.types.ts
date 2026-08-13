import { HealTag, SkillCooldownConfig, SkillDamageFlags } from "netim2-shared";
import { EscaladoAtributos } from "../escalado-atributos-types";
import { SkillScalingLv } from "../escalado-lv.types";

export interface SkillHealScaling {
    type: 'heal'
    cd: SkillCooldownConfig;
    mana: { base: number, perLv: number },
    components: SkillHealComponentScaling
}

export interface SkillHealComponentScaling {
    tags: HealTag[];
    escaladoMain: {
        min: number;
        max: number;
    };
    escaladoLv: SkillScalingLv;
    escaladoAtributos?: EscaladoAtributos
    flags?: SkillDamageFlags;
}