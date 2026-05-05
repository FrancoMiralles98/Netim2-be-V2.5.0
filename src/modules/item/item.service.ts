import { Injectable } from '@nestjs/common';
import { BASE_EQUIPO_OPTIONS } from '../character/const/characterProps/base-equipo-options.const';
import { EQUIP_RULES } from './config/items-rule.const';
import { ITEM_LV_REROLL_CONFIG } from './config/item-lv-reroll.config';
import { TierReroll } from './types/item-lv-reroll.type';
import { randomNumberInRange } from '../shared/functions/random-number-in-range.function';

@Injectable()
export class ItemService {


    rollItemLv(lvReq: number): number {
        const distanceToMax = EQUIP_RULES.MAX_ITEM_LV - lvReq;

        const config = ITEM_LV_REROLL_CONFIG.find(c =>
            distanceToMax >= c.minDistance &&
            distanceToMax <= c.maxDistance
        );

        if (!config) {
            throw new Error(`No reroll config for distance: ${distanceToMax}`);
        }

        const tier = this.getWeightedTier(config.tier);

        const maxAllowedBonus = Math.min(tier.maxBonusLv, distanceToMax);

        const bonusLv = randomNumberInRange(
            tier.minBonusLv,
            maxAllowedBonus
        );

        return lvReq + bonusLv;
    }


    private getWeightedTier (tiers:TierReroll[] ) {
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
