import { Injectable } from "@nestjs/common";
import { EQUIP_RULES } from "src/modules/item/config/items-rule.const";
import { MAX_MULTIPLIER, MIN_MULTIPLIER, SCALING_PER_ITEM_LV } from "../config/item-lv-bonus-scaling.config";
import { RngService } from "src/modules/shared/services/rng.service";

@Injectable()
export class ItemLevelScalingService {
    constructor(
        private rngService: RngService
    ) {}

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

        return this.rngService.randomNumberInRange(min, scaledMax)
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
        const limitItemLv = Math.min(Math.max(itemLv, EQUIP_RULES.MIN_ITEM_LV), EQUIP_RULES.MAX__NORMAL_ITEM_LV);

        return Math.min(MAX_MULTIPLIER, MIN_MULTIPLIER + limitItemLv * SCALING_PER_ITEM_LV)
    }
}