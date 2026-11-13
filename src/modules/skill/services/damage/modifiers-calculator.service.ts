import { Injectable } from '@nestjs/common';
import type { DamageSkillValueScaling, SkillDamage, SkillWeightedOptionScaling } from 'netim2-shared';
import { SharedSkillScalingService } from '../shared-skill-scaling.service';
import type { SkillScalingContext } from '../../types/skill-scaling-context.type';

/** Prepara modificadores calculados; la selección aleatoria y las condiciones se resuelven en combate. */
@Injectable()
export class ModifiersCalculatorService {
    constructor(private readonly scalingValues: SharedSkillScalingService) {}

    /** Calcula golpes enteros y factor por golpe; devuelve undefined si no hay modificador habilitado. */
    getHitModifier(context: SkillScalingContext, scaling: DamageSkillValueScaling): SkillDamage['hitModifiers'] {
        const modifier = scaling.hitModifiers;
        if (!modifier) return undefined;
        if (modifier.type === 'chance_multi_hit') {
            if (!this.scalingValues.isUnlocked(modifier.unlockAt, context)) return undefined;
            return {
                type: modifier.type,
                chance: this.scalingValues.calculateConstrainedValue(modifier.chance, context, 0, false, 100),
                hits: this.scalingValues.calculateConstrainedValue(modifier.hits, context, 1, true),
                damageMultiplierPerHit: this.scalingValues.calculateConstrainedValue(modifier.damageMultiplierPerHit, context, 0),
                description: modifier.description,
            };
        }
        const options = this.weightedOptions(modifier.options, context);
        if (options.length === 0) return undefined;
        return {
            type: 'weighted_hit_count',
            options: options.map(({ option, weight }) => ({
                // El contrato calculado conserva chance, pero representa peso relativo.
                chance: weight,
                hits: this.scalingValues.calculateConstrainedValue(option.hits, context, 1, true),
                damageMultiplierPerHit: this.scalingValues.calculateConstrainedValue(option.damageMultiplierPerHit, context, 0),
                description: option.description,
            })),
        };
    }

    /** Calcula chances, pesos y multiplicadores; conserva la condición sin evaluar source/target. */
    getDamageModifier(context: SkillScalingContext, scaling: DamageSkillValueScaling): SkillDamage['damageModifiers'] {
        const modifier = scaling.damageModifiers;
        if (!modifier) return undefined;
        if (modifier.type === 'weighted_multiplier') {
            const options = this.weightedOptions(modifier.options, context);
            if (options.length === 0) return undefined;
            return {
                type: modifier.type,
                options: options.map(({ option, weight }) => ({
                    chance: weight,
                    multiplier: this.scalingValues.calculateConstrainedValue(option.multiplier, context, 0),
                    description: option.description,
                })),
            };
        }
        if (!this.scalingValues.isUnlocked(modifier.unlockAt, context)) return undefined;
        const multiplier = this.scalingValues.calculateConstrainedValue(modifier.multiplier, context, 0);
        if (modifier.type === 'chance_multiplier') {
            return {
                type: modifier.type, multiplier, description: modifier.description,
                chance: this.scalingValues.calculateConstrainedValue(modifier.chance, context, 0, false, 100),
            };
        }
        return { type: modifier.type, multiplier, description: modifier.description, condition: structuredClone(modifier.condition) };
    }

    /** Filtra desbloqueos y calcula pesos sin cap de 100; rechaza IDs duplicados y totales no positivos. */
    private weightedOptions<T extends SkillWeightedOptionScaling>(options: readonly T[], context: SkillScalingContext) {
        const ids = new Set<string>();
        for (const option of options) {
            if (ids.has(option.id)) throw new Error('ID de opción ponderada duplicado');
            ids.add(option.id);
        }
        const enabled = options.filter(option => this.scalingValues.isUnlocked(option.unlockAt, context)).map(option => ({
            option,
            weight: this.scalingValues.calculateConstrainedValue(option.weight, context, 0),
        }));
        const total = enabled.reduce((sum, item) => sum + item.weight, 0);
        if (enabled.length > 0 && (!Number.isFinite(total) || total <= 0)) throw new Error('La tabla ponderada debe tener peso total positivo y finito');
        return enabled;
    }
}
