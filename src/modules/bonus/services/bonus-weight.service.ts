import { WEIGHT_RARITY_MODIFIERS_CONFIG } from "../config/weight-rarity-modifiers.config";
import { BONUS_LIST } from "../const/bonus-list.cons";
import { BonusInItem } from "../types/bonus-in-item.type";
import { BonusType } from "../types/bonusListHelper/bonus.type";

export class BonusWeightService {
    
    getBonusWeight(explicitBonus:BonusInItem[]): number {
        let totalWeight = 0
        for (const bonus of explicitBonus) {
            const baseInfo = this.getBaseInfoOfBonus(bonus)
            const value = this.calculateWeightValue(bonus,baseInfo)
            totalWeight += value
        }

        return totalWeight
    }


    private getBaseInfoOfBonus (bonus:BonusInItem):BonusType {
        const bonusToSearch = BONUS_LIST.find(bonusInList => 
            bonusInList.name.bonus_ref_name === bonus.bonusRef)
        
        if (!bonusToSearch) {
            throw new Error('Bonus not found')
        }
        return bonusToSearch
    }

    private calculateWeightValue(actualBonus:BonusInItem,baseBonusInfo: BonusType): number {
        if (typeof actualBonus.bonusValue !== 'number') {
            throw new Error ('El valor del bonus debe ser de tipo number')
        }
        if (!baseBonusInfo.tier) {
            throw new Error ('El bonus debe de ser tipo generico y tener un tier asignado')
        }

        const multiplayerTierLv = WEIGHT_RARITY_MODIFIERS_CONFIG[baseBonusInfo.tier]

        return (actualBonus.bonusValue / baseBonusInfo.values.max) * multiplayerTierLv
    }
}