import { Injectable } from "@nestjs/common";
import { WEIGHT_RARITY_MODIFIERS_CONFIG } from "../config/weight-rarity-modifiers.config";
import { BONUS_LIST } from "../const/bonus-list.cons";
import { BonusInItem } from "../types/bonus-in-item.type";
import { BonusType } from "../types/bonusListHelper/bonus.type";

/**
 * Servicio encargado de calcular el peso total de los bonus de un ítem.
 * 
 * El peso representa qué tan bueno son sus bonus en un ítem sgun:
 * - El valor máximo posible de ese bonus.
 * - El tier del bonus
 * 
 * @note - este peso unicamente se calcula en los bonus explicitos de los items
 */
@Injectable()
export class BonusWeightService {
    
    /**
     * Calcula el peso total de una lista de bonus
     * 
     * @param {BonusInItem[]} explicitBonus - Lista de bonus del ítem.
     * @returns {number} Peso total acumulado.
     */
    getBonusWeight(explicitBonus:BonusInItem[]): number {
        let totalWeight = 0
        for (const bonus of explicitBonus) {
            const baseInfo = this.getBaseInfoOfBonus(bonus)
            const value = this.calculateWeightValue(bonus,baseInfo)
            totalWeight += value
        }

        return totalWeight
    }


    /**
     * Obtiene la información base de un bonus desde la lista global
     * para comparar con el bonus que tiene el item
     * 
     * @param {BonusInItem} bonus - Bonus del ítem.
     * @returns {BonusType} Información base del bonus.
     *
     */
    private getBaseInfoOfBonus (bonus:BonusInItem):BonusType {
        const bonusToSearch = BONUS_LIST.find(bonusInList => 
            bonusInList.name.bonus_ref_name === bonus.bonusRef)
        
        if (!bonusToSearch) {
            throw new Error('Bonus not found')
        }
        return bonusToSearch
    }

    /**
     * Calcula el peso de un bonus.
     *
     * - Se calcula en base a la proporción del valor obtenido vs el máximo posible.
     *   que luego se multiplica por un modificador según el tier
     * 
     * @param {BonusInItem} actualBonus - Bonus aplicado al ítem.
     * @param {BonusType} baseBonusInfo - Información base del bonus.
     * 
     * @returns {number} Peso del bonus.
     * 
     */
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