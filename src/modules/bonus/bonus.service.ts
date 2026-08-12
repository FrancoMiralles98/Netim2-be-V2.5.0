import { Injectable } from "@nestjs/common";
import { BonusWeightService } from "./services/bonus-weight.service";
import { LimitBonusService } from "./services/limit-bonus.service";
import { BonusInItem } from "./types/bonus-in-item.type";
import { BonusCategory } from "./types/bonusListHelper/bonus.type";
import { ItemBonusQuality } from "./types/item-bonus-quaility.type";
import { GenerateItemBonusService } from "./services/generate-item-bonus.service";
import { subTypeEquip } from "../item/types/entities-props/equip.type";
import { Stats } from "netim2-shared";

@Injectable()
export class BonusService {
    constructor(
        private bonusWeightService: BonusWeightService,
        private generateItemBonusService: GenerateItemBonusService,
        private limitBonusService: LimitBonusService,
    ) { }

    generatorBonus(
        category: BonusCategory, 
        bonusUsed: BonusInItem[], 
        itemLv: number,
        quality: ItemBonusQuality =  'normal',
        maxQuantity: number,
        action: 'add' | 'change' | 'random',
        sub_type_equip: subTypeEquip,
        quantity?:number,
    ): BonusInItem[] {
        return this.generateItemBonusService.buildItemBonus(
            bonusUsed,
            category,
            action,
            itemLv,
            quality,
            maxQuantity,
            sub_type_equip,
            quantity
        )
    }

    limitStatsBonus (stats:Stats): Stats {
        return this.limitBonusService.applyBonusLimitsToStats(stats)
    }

    getTotalBonusWeight (bonus: BonusInItem[]): number {
        return this.bonusWeightService.getBonusWeight(bonus)
    }

}