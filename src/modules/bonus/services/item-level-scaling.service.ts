import { Injectable } from "@nestjs/common";
import { EQUIP_RULES } from "src/modules/item/config/items-rule.const";
import { randomNumberInRange } from "src/modules/shared/functions/random-number-in-range.function";
import { MAX_MULTIPLIER, MIN_MULTIPLIER, SCALING_PER_ITEM_LV } from "../config/item-lv-bonus-scaling.config";

@Injectable()
export class ItemLevelScalingService {
    /**
      * Aplica escalado al valor de un bonus en segun el itemLevel
      * 
      * - A mayor nivel de ítem → mayor rango efectivo del bonus.
      * - El valor máximo se ajusta con un multiplicador.
      * 
      * @param {number} min - Valor mínimo del bonus.
      * @param {number} max - Valor máximo del bonus.
      * @param {number} itemLv - Nivel del ítem interno.
      * 
      */
    applyItemLevelScalingToBonus(min: number, max: number, itemLv: number): number {
        const multiplayer = this.getItemLvBonusMultiplier(itemLv)

        //se ajusta el valor maximo que puede tener un bonus segun el itemLevel
        const scaledMax = min + Math.floor((max - min) * multiplayer);

        return Number(randomNumberInRange(min, scaledMax, true).toFixed(1))
    }


    /**
 * Calcula el multiplicador de escalado según el nivel del ítem.
 * 
 * @example - si itemLv es 100 su multiplicador sera de 1
 * es decir que podra obtener el valor maximo de cualquier bonus
 * 
 * @param {number} itemLv - Nivel del ítem.
 * 
 * @returns {number} Multiplicador de escalado.
 */
    private getItemLvBonusMultiplier(itemLv: number): number {
        const limitItemLv = Math.min(Math.max(itemLv, EQUIP_RULES.MIN_ITEM_LV), EQUIP_RULES.MAX_ITEM_LV);

        return Math.min(MAX_MULTIPLIER, MIN_MULTIPLIER + limitItemLv * SCALING_PER_ITEM_LV)
    }
}