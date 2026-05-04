import { Injectable } from '@nestjs/common';
import { BonusCategory, BonusTierLv, BonusType } from './types/bonusListHelper/bonus-list.type';
import { BONUS_LIST } from './const/bonusList/bonus-list.cons';
import { TIER_BONUS_PROBABILITIES } from './const/tier-bonus-probabilites.const';
import { randomIntInRange } from '../shared/functions/random-Int-in-range.function';
import { BonusInItem } from './types/bonus-in-item.type';

@Injectable()
export class BonusService {
    generateBonus(category: BonusCategory, bonusUsed: BonusInItem[] = []): BonusInItem {

    }


    private generateGenericBonus(bonusUsed:BonusInItem[] = []) {
        const tierToUse = this.pickBonusTier()
        const filterList = this.getBonusListByCategory("generic",bonusUsed).filter(b=> b.tier === tierToUse)
        if (filterList.length === 0) {
            throw new Error('No hay suficientes bonus disponibles')
        }
        const bonus = this.selectRandomBonusOfList(filterList)

    }


    private pickBonusTier(): BonusTierLv {
        const allTiers = Object.entries(TIER_BONUS_PROBABILITIES).map(
            ([key, value]) => [Number(key) as BonusTierLv, value] as [BonusTierLv, number]
        );
        const random = Math.random() * 100

        let accumulated = 0

        for (const [tier, weight] of allTiers) {
            accumulated += weight

            if (random < accumulated) {
                return tier
            }
        }
        return 1
    }

    private getBonusListByCategory(category: BonusCategory, bonusUsed: BonusInItem[] = []): BonusType[] {
        const usedBonusRef = new Set(bonusUsed.map(b=> b.bonusRef))

        return BONUS_LIST.filter(bonus =>
            bonus.category === category &&
            !usedBonusRef.has(bonus.name.bonus_ref_name)
        )
    }

    private selectRandomBonusOfList(list: BonusType[]): BonusType {
        const randomIndex = randomIntInRange(0, list.length - 1) //se resta 1 del total porque se busca un index de la lista
        const bonusToUse = list[randomIndex]
        if (!bonusToUse) {
            throw new Error('No se encuentra un bonus para usar')
        }
        return bonusToUse
    }

}
