import { Injectable } from "@nestjs/common";
import { BonusType } from "../types/bonusListHelper/bonus.type";
import { BonusInItem } from "../types/bonus-in-item.type";
import { MEDIA_HABILIDAD_ROLL_CONFIG } from "../config/media-habilidad-roll.config.";
import { SpecialBonus, TierConfigs } from "../types/media-habilidad-roll-config.type";
import { BONUS_LIST } from "../const/bonus-list.cons";
import { ItemLevelScalingService } from "./item-level-scaling.service";
import { RngService } from "src/modules/shared/services/rng.service";

/**
 * Servicio encargado de gestionar la generación de bonus especiales.
 * 
 * en los bonus especiales su valor se calcula de forma dinamica dependiendo del tier
 * cuanto mas alto es el tier mas dificil es de conseguirlo
 * 
 * Cuando se genera uno, automáticamente se genera su "counter bonus"
 * con el mismo tier pero con valor negativo.
 * 
 * Ejemplo:
 * +40 media / -20 habilidad
 */
@Injectable()
export class SpecialBonusService {

    constructor(
        private itemLevelScalingService: ItemLevelScalingService,
        private rngService: RngService
    ){}

    isSpecialBonus(bonus: BonusType): boolean {
        return bonus.name.bonus_ref_name === 'media' || bonus.name.bonus_ref_name === 'habilidad'
    }

    /**
     * Genera un bonus especial junto con su contra bonus.
     *
     * - Genera el bonus principal con valor positivo.
     * - Genera el counter bonus con el mismo tier pero valor negativo.
     * 
     * @param {BonusType} bonus - Bonus base desde el cual generar los valores.
     * @returns {BonusInItem[]} Array con:
     *   - [0]: bonus principal
     *   - [1]: counter bonus
     */
    generateSpecialBonuses(bonus: BonusType,itemLv: number): BonusInItem[] {
        if (!this.isSpecialBonus(bonus)) {
            throw new Error('No se un bonus especial')
        }

        // determina el tier según probabilidades
        const tierBonus = this.getTierOfBonus(bonus.name.bonus_ref_name as SpecialBonus)

        const bonusValue = this.itemLevelScalingService.applyItemLevelScalingToBonus(
            tierBonus.minValue, tierBonus.maxValue,itemLv)
            
        const mainBonus = {
            bonusFullName: bonus.name.full_name,
            bonusRef: bonus.name.bonus_ref_name,
            bonusValueType: bonus.name.type_value,
            bonusValue
        }

        const counterBonus = this.getCounterBonus(tierBonus.tier, bonus.name.bonus_ref_name as SpecialBonus)

        return [mainBonus, counterBonus]
    }

    /**
     * Obtiene el tier de un bonus especial en base a probabilidades acumuladas.
     * 
     * @param {SpecialBonus} bonusRefName - Tipo de bonus ("media" o "habilidad").
     * @returns {TierConfigs} Configuración del tier seleccionado.
     */
    private getTierOfBonus(bonusRefName: SpecialBonus): TierConfigs {
        const getRolls = MEDIA_HABILIDAD_ROLL_CONFIG[bonusRefName]

        const randomNumber = Math.random() * 100

        let acc = 0

        for (const roll of getRolls) {
            acc += roll.probability
            if (randomNumber < acc) {
                return roll
            }
        }

        return getRolls[0];
    }


    /**
     * Genera el counter bonus (bonus inverso) al bonus principal.
     * - Usa el mismo tier que el bonus principal.
     * - Invierte el tipo de bonus:
     *   media → habilidad
     *   habilidad → media
     * - El valor generado es negativo.
     * 
     * @param {number} tier - Tier del bonus principal.
     * @param {SpecialBonus} bonusRefName - Tipo del bonus principal.
     * @returns {BonusInItem} Counter bonus generado.
     */
    private getCounterBonus(tier: number, bonusRefName: SpecialBonus): BonusInItem {
        const counterBonusRef: SpecialBonus = bonusRefName === 'media'
        ? 'habilidad' 
        : 'media'

        const baseInfoOfBonus = BONUS_LIST.find(bonus => bonus.name.bonus_ref_name === counterBonusRef)

        if (!baseInfoOfBonus) {
            throw new Error('No se encuentra el bonus correspondiente')
        }

        const tierBonus = MEDIA_HABILIDAD_ROLL_CONFIG[counterBonusRef].find(
            roll => roll.tier === tier,
        )

        if (!tierBonus) {
            throw new Error(`No existe configuración para el tier ${tier}`);
        }

        const value = -Number(this.rngService.randomNumberInRange(tierBonus.minValue, tierBonus.maxValue))

        return {
            bonusFullName: baseInfoOfBonus.name.full_name,
            bonusRef: counterBonusRef,
            bonusValue: value,
            bonusValueType: baseInfoOfBonus.name.type_value
        }
    }
} 