import { SkillHeal } from "netim2-shared"
import { BaseSkillEntity } from "./skill-base.entity"
import { SkillHealSummary } from "../types/summary-skills.types"

export class SkillHealEntity extends BaseSkillEntity<SkillHeal> {
    constructor(props: SkillHeal) {
        super(props)
    }

    toPrimitives() {
        return structuredClone(this.props)
    }

    /** Arma la skill base con un componente válido; el calculador completa el rango con las stats del personaje. */
    static summaryToSkillType(summary: SkillHealSummary, scaling: SkillHeal['escalado']): SkillHeal {
        return {
            components: {
                range: { min: 0, max: 0 },
                tags: [...scaling.components.tags],
            },
            ...summary,
            lv: 1,
            mastery: 'N',
            cd: {},
            nombre: '',
            flags: scaling.flags ? { ...scaling.flags } : undefined,
            escalado: structuredClone(scaling),
        }
    }
}
