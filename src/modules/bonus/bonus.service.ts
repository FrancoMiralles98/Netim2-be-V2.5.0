import { Injectable } from "@nestjs/common";
import { BonusWeightService } from "./services/bonus-weight.service";
import { GenerateBonusService } from "./services/generate-bonus.service";
import { LimitBonusService } from "./services/limit-bonus.service";
import { BonusInItem } from "./types/bonus-in-item.type";
import { BonusCategory } from "./types/bonusListHelper/bonus.type";
import { CharacterStats } from "../character/types/baseCharacterProps/character-stats.type";
import { ItemBonusQuality } from "./types/item-bonus-quaility.type";

@Injectable()
export class BonusService {
    constructor(
        private bonusWeightService: BonusWeightService,
        private generateBonusService: GenerateBonusService,
        private limitBonusService: LimitBonusService,
    ) { }

    generatorBonus(
        category: BonusCategory, 
        bonusUsed: BonusInItem[], 
        itemLv: number,
        quality: ItemBonusQuality =  'normal'
    ): BonusInItem[] {
        return this.generateBonusService.generateBonus(category, bonusUsed, itemLv,quality)
    }

    limitStatsBonus (stats:CharacterStats): CharacterStats {
        return this.limitBonusService.applyBonusLimitsToStats(stats)
    }

    getTotalBonusWeight (bonus: BonusInItem[]): number {
        return this.bonusWeightService.getBonusWeight(bonus)
    }

}