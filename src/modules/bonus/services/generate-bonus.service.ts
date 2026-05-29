import { Injectable } from '@nestjs/common';
import { BonusCategory, BonusTierLv, BonusType } from '../types/bonusListHelper/bonus.type';
import { BONUS_LIST } from '../const/bonus-list.cons';
import { TIER_BONUS_PROBABILITIES_X_QUALITY } from '../config/tier-bonus-probabilites.config';
import { BonusInItem } from '../types/bonus-in-item.type';
import { SpecialBonusService } from './special-bonus.service';
import { ItemLevelScalingService } from './item-level-scaling.service';
import { RngService } from 'src/modules/shared/services/rng.service';
import { ItemDropQuality } from 'src/modules/drop/types/item-drop-quaility.type';

/**
 * Servicio encargado de la generación de bonus para ítems.
 */
@Injectable()
export class GenerateBonusService {


    constructor(
        private specialBonusService: SpecialBonusService,
        private itemLevelScalingService: ItemLevelScalingService,
        private rngService: RngService
    ) { }

    /**
     * Genera uno o más bonus para un ítem.
     * 
     * @param {BonusCategory} category - Categoría de bonus a generar
     * @param {BonusInItem[]} [bonusUsed=[]] - Lista de bonus ya aplicados al ítem, para evita duplicados.
     * @param {number} itemLv - Nivel del ítem interno, usado para escalar el valor del bonus.
     * @param {ItemDropQuality} quality - calidad de las chances de que salga un buen bonus
     * 
     * @returns {BonusInItem[]} Array de bonus generados:
     *  - Bonus genérico → retorna 1 elemento.
     *  - Bonus especial → retorna 2 elementos (bonus + counter bonus).
     */
    generateBonus(
        category: BonusCategory,
        bonusUsed: BonusInItem[] = [],
        itemLv: number,
        quaility: ItemDropQuality = 'normal'
    ): BonusInItem[] {
        const tierToUse = this.pickBonusTier(quaility)
        const filterList = this.getBonusListByCategory(category, bonusUsed).filter(b => b.tier === tierToUse)

        if (filterList.length === 0) {
            throw new Error('No hay suficientes bonus disponibles')
        }

        const bonusToUse = this.selectRandomBonusOfList(filterList)

        if (this.specialBonusService.isSpecialBonus(bonusToUse)) {
            return this.specialBonusService.generateSpecialBonuses(bonusToUse, itemLv)
        }

        const genericBonus: BonusInItem = {
            bonusFullName: bonusToUse.name.full_name,
            bonusRef: bonusToUse.name.bonus_ref_name,
            bonusValueType: bonusToUse.name.type_value,
            bonusValue: this.itemLevelScalingService.applyItemLevelScalingToBonus(
                bonusToUse.values.min, bonusToUse.values.max, itemLv)
        }

        return [genericBonus]
    }

    /**
     * Selecciona un tier de bonus en base a probabilidades acumuladas
     * 
     * @returns {BonusTierLv} Tier seleccionado.
     */
    private pickBonusTier(quaility: ItemDropQuality = 'normal'): BonusTierLv {
        const allTiers = Object.entries(TIER_BONUS_PROBABILITIES_X_QUALITY[quaility]).map(
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
        const randomIndex = this.rngService.randomNumberInRange(0, list.length - 1)
        const bonusToUse = list[randomIndex]
        if (!bonusToUse) {
            throw new Error('No se encuentra un bonus para usar')
        }
        return bonusToUse
    }
}
