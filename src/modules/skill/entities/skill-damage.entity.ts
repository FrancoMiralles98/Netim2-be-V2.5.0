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

    /** Arma la skill base con un componente válido; el calculador completa el rango con las stats del personaje. */
    static summaryToSkillType(summary: SkillDamageSummary, scaling: SkillDamage['escalado']): SkillDamage {
        return {
            ...summary,
            lv: 1,
            mastery: 'N',
            components: {
                range: { min: 0, max: 0 },
                damageType: scaling.components.damageType,
                tags: [...scaling.components.tags],
                flags: scaling.components.flags ? { ...scaling.components.flags } : undefined,
            },
            cd: {},
            nombre: '',
            escalado: structuredClone(scaling),
        }
    }

}
