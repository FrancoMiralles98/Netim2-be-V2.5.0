import { Injectable } from "@nestjs/common";
import { LetterMasteryLv, SkillDamage, WeightedDamageModifier, WeightedHitCountModifier } from "netim2-shared";
import { SharedSkillService } from "../shared-skill.service";
import { SkillDamageScaling, WeightedDamageModifierScaling, WeightedHitCountScaling } from "../../types/scaling/damage/skill-damage-scaling.type";

@Injectable()
export class ModifiersCalculatorService {
    constructor(
        private readonly sharedSkillService: SharedSkillService,
    ) { }

    getHitModifier(
        skill: SkillDamage,
        lvPoints: number,
        scaling: SkillDamageScaling,
    ): SkillDamage['hitModifiers'] {
        const scalingInfo = scaling.hitModifiersScaling;

        if (!scalingInfo) return undefined

        switch (scalingInfo.type) {
            case 'chance_multi_hit': {
                const chance =
                    scalingInfo.chancesConfig.base +
                    lvPoints * scalingInfo.chancesConfig.per_lv

                const hits =
                    scalingInfo.hitsConfig.base +
                    lvPoints * scalingInfo.hitsConfig.perLv

                return {
                    type: 'chance_multi_hit',
                    chance: this.clampPercentage(chance),
                    damageMultiplierPerHit:
                        scalingInfo.damageMultiplierPerHitConfig.base +
                        lvPoints *
                        scalingInfo.damageMultiplierPerHitConfig.perLv,
                    hits: Math.max(1, Math.floor(hits)),
                }
            }
            case 'weighted_hit_count':
                return this.calculateWeightedHitModifier(skill, lvPoints, scalingInfo)
            default:
                throw new Error(`Tipo de escalado de golpes no soportado`)
        }
    }

    getDamageModifier(
        skill: SkillDamage,
        lvPoints: number,
        scaling: SkillDamageScaling,
    ): SkillDamage['damageModifiers'] {
        const scalingInfo = scaling.damageModifiersScaling;

        if (!scalingInfo) return undefined;


        switch (scalingInfo.type) {
            case 'chance_multiplier': {
                const chance =
                    scalingInfo.chanceConfig.baseChance +
                    lvPoints *
                    scalingInfo.chanceConfig.perLv

                return {
                    type: 'chance_multiplier',
                    chance: this.clampPercentage(chance),
                    multiplier:
                        scalingInfo.multiplier.baseMultiplier +
                        lvPoints *
                        scalingInfo.multiplier.perLv,
                }
            }
            case 'conditional_multiplier':
                return {
                    type: 'conditional_multiplier',
                    condition: scalingInfo.condition,
                    multiplier:
                        scalingInfo.multiplier.baseMultiplier +
                        lvPoints *
                        scalingInfo.multiplier.perLv,
                }
            case 'weighted_multiplier':
                return this.calculateWeightedDamageModifier(skill,lvPoints,scalingInfo)
            default:
                throw new Error(`Tipo de modificador de daño no soportado`)
        }
    }

    private calculateWeightedHitModifier(
        skill: SkillDamage,
        lvPoints: number,
        scaling: WeightedHitCountScaling,
    ): WeightedHitCountModifier {
        const skillMasteryRank = this.getSkillMasteryRank(skill);

        const options = scaling.optionsScaling
            .filter(option =>this.isOptionUnlocked(skillMasteryRank,option.unlockLv))
            .map(option => {
                const chance =
                    option.chancesConfig.base +
                    option.chancesConfig.per_lv * lvPoints;

                const hits =
                    option.hitsConfig.base +
                    option.hitsConfig.perLv * lvPoints;

                return {
                    chance: this.clampPercentage(chance),
                    hits: Math.max(1, Math.floor(hits)),
                    damageMultiplierPerHit:
                        option.damageMultiplierPerHitConfig.base +
                        option.damageMultiplierPerHitConfig.perLv *
                        lvPoints,
                }
            })
        return {
            type: 'weighted_hit_count',
            options,
        }
    }

    private calculateWeightedDamageModifier(
        skill: SkillDamage,
        lvPoints: number,
        scaling: WeightedDamageModifierScaling,
    ): WeightedDamageModifier {
        const skillMasteryRank = this.getSkillMasteryRank(skill);

        const options = scaling.options
            .filter(option =>this.isOptionUnlocked(skillMasteryRank,option.unlockLv))
            .map(option => {
                const chance =
                    option.chanceConfig.baseChance +
                    option.chanceConfig.perLv * lvPoints;

                return {
                    chance: this.clampPercentage(chance),
                    multiplier:
                        option.multiplier.baseMultiplier +
                        option.multiplier.perLv * lvPoints,
                }
            })

        return {
            type: 'weighted_multiplier',
            options,
        }
    }

    private getSkillMasteryRank(
        skill: SkillDamage,
    ): LetterMasteryLv | null {
        if (typeof skill.lv === 'number') {
            return null;
        }
        return this.sharedSkillService.getLetterAndNumberOfMasteryLvRank(skill.lv).letterLv
    }

    private isOptionUnlocked(
        skillMasteryRank: LetterMasteryLv | null,
        requiredMasteryRank?: LetterMasteryLv,
    ): boolean {
        if (!requiredMasteryRank) {
            return true;
        }

        if (skillMasteryRank === null) {
            return false;
        }

        return this.sharedSkillService.meetsMasteryRequirement(skillMasteryRank,requiredMasteryRank)
    }

    private clampPercentage(value: number): number {
        return Math.max(0, Math.min(100, value));
    }
}