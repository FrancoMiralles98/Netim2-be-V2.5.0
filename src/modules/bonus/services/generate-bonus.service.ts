import { Injectable } from '@nestjs/common';
import { BonusCategory, BonusTierLv, BonusType } from '../types/bonusListHelper/bonus.type';
import { BONUS_LIST } from '../const/bonus-list.cons';
import { TIER_BONUS_PROBABILITIES } from '../config/tier-bonus-probabilites.config';
import { randomNumberInRange } from '../../shared/functions/random-number-in-range.function';
import { BonusInItem } from '../types/bonus-in-item.type';
import { SpecialBonusService } from './special-bonus.service';

@Injectable()
export class GenerateBonusService {

    constructor(
        private specialBonusService: SpecialBonusService
    ) { }

     generateBonus(category: BonusCategory, bonusUsed: BonusInItem[] = []): BonusInItem[] {
        const tierToUse = this.pickBonusTier()
        const filterList = this.getBonusListByCategory(category, bonusUsed).filter(b => b.tier === tierToUse)

        if (filterList.length === 0) {
            throw new Error('No hay suficientes bonus disponibles')
        }

        const bonus = this.selectRandomBonusOfList(filterList)

        if (this.specialBonusService.isSpecialBonus(bonus)) {
            return this.specialBonusService.generateSpecialBonuses(bonus)
        }

        const genericBonus: BonusInItem = {
            bonusFullName: bonus.name.full_name,
            bonusRef: bonus.name.bonus_ref_name,
            bonusValueType: bonus.name.type_value,
            bonusValue: randomNumberInRange(bonus.values.min, bonus.values.max)
        }

        return [genericBonus]

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
        const usedBonusRef = new Set(bonusUsed.map(b => b.bonusRef))

        return BONUS_LIST.filter(bonus =>
            bonus.category === category &&
            !usedBonusRef.has(bonus.name.bonus_ref_name)
        )
    }

    private selectRandomBonusOfList(list: BonusType[]): BonusType {
        //se resta 1 del total porque se busca un index de la lista
        const randomIndex = randomNumberInRange(0, list.length - 1)
        const bonusToUse = list[randomIndex]
        if (!bonusToUse) {
            throw new Error('No se encuentra un bonus para usar')
        }
        return bonusToUse
    }

}
