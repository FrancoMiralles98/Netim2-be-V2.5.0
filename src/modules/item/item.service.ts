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
import { RandomImplicitBonusService } from './services/implicitScaling/random-implicit-bonus.service';
import { BonusInItem } from '../bonus/types/bonus-in-item.type';
import { UpgradeLv } from './types/config/general-implicit.type';
import { subTypeEquip } from './types/entities-props/equip.type';
import { Reward } from './types/entities-props/chest.type';
import { ItemFactory } from './factories/item-factory';
import { Chest } from './entities/chest.entity';

@Injectable()
export class ItemService {

    constructor(
        private rngService: RngService,
        private itemImplicitBonusService: ItemImplicitBonusService,
        private itemHydrationService: ItemHydrationService,
        private itemFactory: ItemFactory,
        private randomImplicitBonusService: RandomImplicitBonusService,
    ) { }

    generateRandomImplicitBonus(
        lvReq: number,
        upgradeLv: UpgradeLv,
        sub_type_equip: subTypeEquip
    ): BonusInItem[] {
        return this.randomImplicitBonusService.generateRandomImplicitBonus(lvReq, upgradeLv, sub_type_equip)
    }

    openChest(item: InventoryItem): Reward[] {
        const chest = this.itemFactory.create(item)
        if (!(chest instanceof Chest)) {
            throw new Error('el item tiene que ser de tipo chest')
        }

        return chest.open()
    }


    getCoreItemInfoByIdItem(
        idItem: IdItemList,
    ): ItemDTO {
        const itemBaseInfo = structuredClone(ITEM_LIST.find(item => item.idItem === idItem))

        if (!itemBaseInfo) {
            throw new Error(`item not found ${idItem}`)
        }

        this.itemImplicitBonusService.getUpdatedImplicits(itemBaseInfo)

        return itemBaseInfo
    }

    getUpdatedImplicitBonus(item: ItemDTO): ItemDTO {
        this.itemImplicitBonusService.getUpdatedImplicits(item)
        return item
    }

    


    getUpdatedInventoryItem(
        item: InventoryItem
    ): InventoryItem {
        const baseItem = this.getCoreItemInfoByIdItem(item.idItem)

        return this.itemHydrationService.hydrateInventoryItem(baseItem, item)
    }


    rollItemLv(lvReq: number, bonification?: number): number {
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

        let bonusLv = this.rngService.randomNumberInRange(
            tier.minBonusLv,
            maxAllowedBonus
        );

        bonusLv += bonification || 0

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
