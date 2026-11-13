import { Injectable } from '@nestjs/common';
import type { Atributos, DamageSkillValueScaling, SkillDamage, Stats } from 'netim2-shared';
import { SharedSkillScalingService } from '../shared-skill-scaling.service';

/** Calcula el rango base del componente único, antes de tiradas, crítico y mitigación. */
@Injectable()
export class DamageCalculatorService {
    constructor(private readonly scalingValues: SharedSkillScalingService) {}

    /** Suma base y contribuciones configuradas por extremo; no agrega AD/AP implícitamente. */
    getDamage(skill: SkillDamage, scaling: DamageSkillValueScaling, stats: Stats, attributes: Atributos): SkillDamage['components'] {
        const context = this.scalingValues.createContext(skill, stats, attributes);
        const component = scaling.components;
        return {
            damageType: component.damageType,
            range: this.scalingValues.calculateRange(component.damage.range, context),
            tags: [...component.tags],
            flags: component.flags ? { ...component.flags } : undefined,
            // Las contribuciones se evalúan una sola vez con el snapshot recibido.
            statsScaling: [],
        };
    }
}
