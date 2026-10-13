import { Injectable } from "@nestjs/common";
import { WEIGHT_RARITY_MODIFIERS_CONFIG } from "../config/weight-rarity-modifiers.config";
import { BONUS_LIST } from "../const/bonus-list.cons";
import { BonusInItem, BonusTierLv, BonusType } from "netim2-shared";


/**
 * Servicio encargado de calcular el peso total de los bonus de un ítem.
 * 
 * El peso representa qué tan buenos son sus bonus en un ítem según:
 * - El valor máximo posible de ese bonus.
 * - El tier del bonus
 * 
 * Solo se consideran bonus genéricos. El valor puede superar el máximo base
 * por el escalado de nivel del ítem, sin limitar su peso al 100 %.
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
            if (bonus.category.type !== 'generic') {
                continue
            }

            const tier = bonus.category.tier
            const baseInfo = this.getBaseInfoOfBonus(bonus, tier)
            const value = this.calculateWeightValue(bonus, baseInfo, tier)
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
    private getBaseInfoOfBonus (bonus:BonusInItem, tier: BonusTierLv):BonusType {
        const bonusToSearch = BONUS_LIST.find(bonusInList => 
            bonusInList.bonus_ref_name === bonus.bonusRef &&
            bonusInList.category.type === 'generic' &&
            bonusInList.category.tier === tier)
        
        if (!bonusToSearch) {
            throw new Error(`Bonus genérico no encontrado: ${bonus.bonusRef}, tier ${tier}`)
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
    private calculateWeightValue(actualBonus:BonusInItem,baseBonusInfo: BonusType, tier: BonusTierLv): number {
        if (typeof actualBonus.bonusValue !== 'number') {
            throw new Error ('El valor del bonus debe ser de tipo number')
        }
        const multiplierTierLv = WEIGHT_RARITY_MODIFIERS_CONFIG[tier]

        return (actualBonus.bonusValue / baseBonusInfo.values.max) * multiplierTierLv
    }
}
