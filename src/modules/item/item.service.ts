import { Injectable } from '@nestjs/common';
import { EQUIP_RULES } from './config/items-rule.const';
import { ITEM_LV_REROLL_CONFIG } from './config/item-lv-reroll.config';
import { TierReroll } from './types/item-lv-reroll.type';
import { RngService } from '../shared/services/rng.service';
import { IdItemList } from './types/iditems/id-item-list.type';
import { ItemDTO } from './types/item-dto';
import { ITEM_LIST } from './const/items.const';
import { InventoryItem } from '../inventory/types/inventory-item.type';
import { ItemImplicitBonusService } from './services/implicitScaling/item-implicit-bonus.service';
import { ItemHydrationService } from './services/item-hydration.service';

@Injectable()
export class ItemService {

    constructor(
        private rngService: RngService,
        private itemImplicitBonusService: ItemImplicitBonusService,
        private itemHydrationService: ItemHydrationService,
    ) { }

    getCoreItemInfoByIdItem(
        idItem: IdItemList,
    ): ItemDTO {
        const itemBaseInfo = ITEM_LIST.find(item => item.idItem === idItem)

        if (!itemBaseInfo) {
            throw new Error(`item not found ${idItem}`)
        }

        this.itemImplicitBonusService.getUpdatedImplicits(itemBaseInfo)

        return structuredClone(itemBaseInfo)
    }


    getUpdatedItem(
        item: InventoryItem
    ): InventoryItem {
        const baseItem = this.getCoreItemInfoByIdItem(item.idItem)
        
        return this.itemHydrationService.hydrateInventoryItem(baseItem,item)
    }


    rollItemLv(lvReq: number): number {
        const distanceToMax = EQUIP_RULES.MAX__NORMAL_ITEM_LV - lvReq;

        const config = ITEM_LV_REROLL_CONFIG.find(c =>
            distanceToMax >= c.minDistance &&
            distanceToMax <= c.maxDistance
        );

        if (!config) {
            throw new Error(`No reroll config for distance: ${distanceToMax}`);
        }

        const tier = this.getWeightedTier(config.tier);

        const maxAllowedBonus = Math.min(tier.maxBonusLv, distanceToMax);

        const bonusLv = this.rngService.randomNumberInRange(
            tier.minBonusLv,
            maxAllowedBonus
        );

        return lvReq + bonusLv;
    }



    private getWeightedTier(tiers: TierReroll[]) {
        const random = Math.random() * 100;
        let accumulated = 0;

        for (const tier of tiers) {
            accumulated += tier.probability;

            if (random <= accumulated) {
                return tier;
            }
        }

        return tiers[tiers.length - 1];
    }
}
