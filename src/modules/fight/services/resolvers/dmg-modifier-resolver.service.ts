import { Injectable } from "@nestjs/common";
import { ResolveSkillDamageModifierInput, SkillDamageModifierResolution } from "./dmg-modifier-resolver.types";
import { RngService } from "src/modules/shared/services/rng.service";
import { ChanceDamageModifier, ConditionalDamageModifier, DamageCondition, WeightedDamageModifier } from "netim2-shared";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";
import { PreparedSkillDamageComponent } from "../damage-calculator.types";

@Injectable()
export class DmgModifierResolverService {
    constructor(
        private rngService: RngService
    ) { }

    rollPreparedComponentDamage(component: PreparedSkillDamageComponent): number {
        const { adjustedRange } = component.runtimeScaling;

        return this.rngService.randomNumberInRange(adjustedRange.min, adjustedRange.max);
    }


    resolveSkillDamageModifier(
        { modifier, source, target }: ResolveSkillDamageModifierInput
    ): SkillDamageModifierResolution {
        if (!modifier) {
            return this.getDefaultResult()
        }
        switch (modifier.type) {
            case 'chance_multiplier':
                return this.resolveChanceMultiplier(modifier)
            case 'weighted_multiplier':
                return this.resolveWeightedMultiplier(modifier)
            case 'conditional_multiplier':
                return this.resolveConditionalMultiplier(modifier, source, target)
            default:
                this.assertNever(modifier)
        }
    }


    private getDefaultResult():
        SkillDamageModifierResolution {
        return {
            multiplier: 1,
            applied: false
        };
    }

    private resolveChanceMultiplier(modifier: ChanceDamageModifier): SkillDamageModifierResolution {
        const triggered = this.rngService.rollChance(modifier.chance)
        if (!triggered) {
            return {
                applied: false,
                multiplier: 1,
                description: modifier.description,
                modifierType: modifier.type
            }
        }
        return {
            applied: true,
            multiplier: modifier.multiplier,
            description: modifier.description,
            modifierType: modifier.type
        }
    }

    private resolveWeightedMultiplier(modifier: WeightedDamageModifier): SkillDamageModifierResolution {
        const optionSelected = this.rngService.pickWeightedItem(
            modifier.options, (option) => option.chance)

        return {
            applied: optionSelected.multiplier !== 1,
            multiplier: optionSelected.multiplier,
            description: optionSelected.description,
            modifierType: modifier.type
        }
    }

    private resolveConditionalMultiplier(
        modifier: ConditionalDamageModifier,
        source: FighterCombatEntity,
        target: FighterCombatEntity
    ): SkillDamageModifierResolution {
        const hasCondition = this.matchesCondition(modifier.condition, source, target)
        if (!hasCondition) {
            return {
                applied: false,
                multiplier: 1,
                description: modifier.description,
                modifierType: modifier.type
            }
        }
        return {
            applied: true,
            multiplier: modifier.multiplier,
            description: modifier.description,
            modifierType: modifier.type
        }
    }

    private matchesCondition(
        condition: DamageCondition,
        source: FighterCombatEntity,
        target: FighterCombatEntity
    ): boolean {
        switch (condition.type) {
            case 'target_has_effect':
                return target.hasActiveStatusEffect(condition.effectId);
            case 'source_has_effect':
                return source.hasActiveStatusEffect(condition.effectId);
            default:
                return this.assertNever(condition);
        }
    }


    private assertNever(value: never): never {
        throw new Error(`Unsupported damage modifier: ${JSON.stringify(value)}`);
    }
}