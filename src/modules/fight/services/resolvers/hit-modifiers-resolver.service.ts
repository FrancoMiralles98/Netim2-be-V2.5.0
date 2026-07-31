import { Injectable } from "@nestjs/common";
import { RngService } from "src/modules/shared/services/rng.service";
import { SkillHitModifier } from "netim2-shared";

@Injectable()
export class HitModifiersResolverService {
    constructor(
        private rngService: RngService
    ) { }
    resolveSkillHits(
        modifier: SkillHitModifier | undefined
    ): { hitCount: number, dmgMultiplierPerHit: number } {

        let hitCount = 1
        let dmgMultiplierPerHit = 1

        if (!modifier) {
            return { hitCount, dmgMultiplierPerHit }
        }

            switch (modifier.type) {
                case 'chance_multi_hit':
                    if (this.rngService.rollChance(modifier.chance)) {
                        hitCount *= modifier.hits
                        dmgMultiplierPerHit = modifier.damageMultiplierPerHit
                    }
                    break
                case 'weighted_hit_count':
                    const selectedOption = this.rngService.pickWeightedItem(
                        modifier.options, (option) => option.chance)
                    hitCount = selectedOption.hits,
                        dmgMultiplierPerHit = selectedOption.damageMultiplierPerHit
                    break
                default:
                    throw new Error(`No se encuentra supporteado el type de hitModifier`);
            }
        
        return {
            hitCount: Math.max(1, Math.floor(hitCount)),
            dmgMultiplierPerHit: Math.max(0, dmgMultiplierPerHit)
        };
    }
}