import { Injectable } from '@nestjs/common';
import { BonusCategory, BonusTierLv, BonusType } from '../types/bonusListHelper/bonus.type';
import { BONUS_LIST } from '../const/bonus-list.cons';
import { TIER_BONUS_PROBABILITIES } from '../config/tier-bonus-probabilites.config';
import { randomNumberInRange } from '../../shared/functions/random-number-in-range.function';
import { BonusInItem } from '../types/bonus-in-item.type';
import { SpecialBonusService } from './special-bonus.service';
import { MAX_MULTIPLIER, MIN_MULTIPLIER, SCALING_PER_ITEM_LV } from '../config/item-lv-bonus-scaling.config';
import { EQUIP_RULES } from 'src/modules/item/config/items-rule.const';

/**
 * Servicio encargado de la generación de bonus para ítems.
 */
@Injectable()
export class GenerateBonusService {

    constructor(
        private specialBonusService: SpecialBonusService
    ) { }

    /**
     * Genera uno o más bonus para un ítem.
     * 
     * @param {BonusCategory} category - Categoría de bonus a generar
     * @param {BonusInItem[]} [bonusUsed=[]] - Lista de bonus ya aplicados al ítem, para evita duplicados.
     * @param {number} itemLv - Nivel del ítem interno, usado para escalar el valor del bonus.
     * 
     * @returns {BonusInItem[]} Array de bonus generados:
     *  - Bonus genérico → retorna 1 elemento.
     *  - Bonus especial → retorna 2 elementos (bonus + counter bonus).
     */
    generateBonus(category: BonusCategory, bonusUsed: BonusInItem[] = [], itemLv: number): BonusInItem[] {
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
            bonusValue: this.applyItemLevelScalingToBonus(bonus.values.min, bonus.values.max, itemLv)
        }

        return [genericBonus]
    }

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
     * Selecciona un tier de bonus en base a probabilidades acumuladas
     * 
     * @returns {BonusTierLv} Tier seleccionado.
     */
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

    /**
     * Obtiene la lista de bonus disponibles según categoría,
     * excluyendo los que ya fueron utilizados.
     * 
     * @param {BonusCategory} category - Categoría de bonus.
     * @param {BonusInItem[]} [bonusUsed=[]] - Bonus ya utilizados.
     * 
     * @returns {BonusType[]} Lista de bonus filtrados.
     */
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
