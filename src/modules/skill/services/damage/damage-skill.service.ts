import { Injectable, InternalServerErrorException } from '@nestjs/common';
import type { Atributos, CharacterRace, CharacterSpeciality, DamageSkillValueScaling, SkillDamage, Stats } from 'netim2-shared';
import { SharedSkillScalingService } from '../shared-skill-scaling.service';
import { SkillScalingConfigService } from '../skill-scaling-config.service';
import { DamageCalculatorService } from './damage-calculator.service';
import { EffectsCalculatorService } from './effects-calculator.service';
import { ModifiersCalculatorService } from './modifiers-calculator.service';

/** Coordina el cálculo del daño, costes, efectos y modificadores de una habilidad. */
@Injectable()
export class DamageSkillService {
    constructor(
        private readonly scalingValues: SharedSkillScalingService,
        private readonly configs: SkillScalingConfigService,
        private readonly damageCalculatorService: DamageCalculatorService,
        private readonly effectsCalculatorService: EffectsCalculatorService,
        private readonly modifiersCalculatorService: ModifiersCalculatorService,
    ) {}

    /** Valida el tipo de escalado y devuelve una copia calculada, sin ejecutar ataques ni RNG. */
    getUpdatedSkill(skill: SkillDamage, stats: Stats, race: CharacterRace,
        speciality: CharacterSpeciality, attributes: Atributos): SkillDamage {
        const scaling = this.configs.getSkillScalingInfo(skill.id, race, speciality);
        if (scaling.type !== 'damage') throw new InternalServerErrorException('Escalado de daño inválido');
        return this.buildUpdatedSkill(skill, scaling, stats, attributes);
    }

    /** Usa la misma progresión y fuentes del personaje para todos los valores de la skill. */
    private buildUpdatedSkill(skill: SkillDamage, scaling: DamageSkillValueScaling, stats: Stats, attributes: Atributos): SkillDamage {
        const context = this.scalingValues.createContext(skill, stats, attributes);
        return {
            ...skill,
            escalado: structuredClone(scaling),
            cd: this.scalingValues.calculateCooldowns(scaling.cd, context),
            mana: this.scalingValues.calculateManaCost(scaling.mana, context),
            components: this.damageCalculatorService.getDamage(skill, scaling, stats, attributes),
            mechanicsEffects: this.effectsCalculatorService.getMechanicsEffects(context, scaling),
            statusEffects: this.effectsCalculatorService.getStatusEffects(context, scaling),
            damageModifiers: this.modifiersCalculatorService.getDamageModifier(context, scaling),
            hitModifiers: this.modifiersCalculatorService.getHitModifier(context, scaling),
        };
    }
}
