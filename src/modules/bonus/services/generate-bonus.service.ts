import { Injectable } from '@nestjs/common';
import { BonusCategory, BonusTierLv, BonusType } from '../types/bonusListHelper/bonus.type';
import { BONUS_LIST } from '../const/bonus-list.cons';
import { TIER_BONUS_PROBABILITIES_X_QUALITY } from '../config/tier-bonus-probabilites.config';
import { BonusInItem } from '../types/bonus-in-item.type';
import { SpecialBonusService } from './special-bonus.service';
import { ItemLevelScalingService } from './item-level-scaling.service';
import { RngService } from 'src/modules/shared/services/rng.service';
import { ItemBonusQuality } from 'src/modules/bonus/types/item-bonus-quaility.type';

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
     * @param {ItemBonusQuality} quality - calidad de las chances de que salga un buen bonus
     * 
     * @returns {BonusInItem[]} Array de bonus generados:
     *  - Bonus genérico → retorna 1 elemento.
     *  - Bonus especial → retorna 2 elementos (bonus + counter bonus).
     */
    generateBonus(
        category: BonusCategory,
        bonusUsed: BonusInItem[] = [],
        itemLv: number,
        quaility: ItemBonusQuality = 'normal',
    ): BonusInItem[] {
        const tierToUse = this.pickBonusTier(quaility)

        const filterList = this.getNewBonusList(category, tierToUse, bonusUsed,)

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
    private pickBonusTier(quaility: ItemBonusQuality = 'normal'): BonusTierLv {
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

        const hasMediaOrHabilidad =
            usedBonusRef.has('media') ||
            usedBonusRef.has('habilidad')

        return BONUS_LIST.filter(bonus => {

            if (bonus.category !== category) {
                return false
            }

            if (usedBonusRef.has(bonus.name.bonus_ref_name)) {
                return false
            }

            //Como el daño de media y habilidad van juntos (es decir tiene su contraparte en negativo) se quitan los 2 en caso de tenerlo
            if (hasMediaOrHabilidad && (bonus.name.bonus_ref_name === 'media' || bonus.name.bonus_ref_name === 'habilidad')) {
                return false
            }

            return true
        })


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

    /**
    * Obtiene una lista de bonus disponibles del tier solicitado.
    *
    * Si no existen bonus disponibles en el tier seleccionado,
    * busca progresivamente en tiers superiores hasta encontrar alguno.
    *
    * Ejemplo:
    * - Tier seleccionado: 2
    * - No hay bonus Tier 2
    * - Busca Tier 3
    * - Busca Tier 4
    *
    * Si tampoco existen bonus en tiers superiores,
    * busca en tiers inferiores de forma descendente.
    *
    * Ejemplo:
    * - Tier seleccionado: 4
    * - No hay bonus Tier 4
    * - Busca Tier 3
    * - Busca Tier 2
    * - Busca Tier 1
    *
    * Esto garantiza que siempre se intente utilizar el tier más cercano
    * al originalmente seleccionado por el RNG, evitando rerolls innecesarios.
    *
    * @param category Categoría de bonus a generar.
    * @param selectedTier Tier inicialmente seleccionado.
    * @param bonusUsed Bonus ya utilizados en el ítem para evitar duplicados.
    *
    * @returns Lista de bonus disponibles pertenecientes al tier encontrado.
    */
    private getNewBonusList(
        category: BonusCategory,
        selectedTier: BonusTierLv,
        bonusUsed: BonusInItem[] = [],
    ): BonusType[] {

        const availableBonuses = this.getBonusListByCategory(category, bonusUsed)

        if (availableBonuses.length === 0) {
            throw new Error('No hay bonus disponibles para esta categoría')
        }

        if (category === 'generic' && selectedTier) {
            return this.selectTierBonusList(selectedTier,availableBonuses)
        }

        return availableBonuses
    }


    private selectTierBonusList(
        selectedTier: BonusTierLv,
        availableBonuses: BonusType[],
    ): BonusType[] {
        for (let tier = selectedTier; tier <= 4; tier++) {
            const listByTier = availableBonuses.filter(
                bonus => bonus.tier === tier as BonusTierLv
            )

            if (listByTier.length > 0) {
                return listByTier
            }
        }

        for (let tier = selectedTier - 1; tier >= 1; tier--) {
            const listByTier = availableBonuses.filter(
                bonus => bonus.tier === tier as BonusTierLv
            )

            if (listByTier.length > 0) {
                return listByTier
            }
        }
        throw new Error('No se encontró ningún bonus disponible')
    }
}
