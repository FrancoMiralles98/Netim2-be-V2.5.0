import { BonusRefKeys } from "src/modules/bonus/types/bonusListHelper/ref-bonus-name.type"
import { IMPLICIT_BONUS_TIER_BY_LV_REQ, RANDOM_IMPLICIT_BONUS_CONFIG } from "../../config/equip-implicit-bonus.config"
import { ImplicitBonusTierType } from "../../types/config/implicit-bonus-tier.type"
import { PatternScaleType, UpgradeLv } from "../../types/config/general-implicit.type"
import { PATTERN_SCALE_CONFIG } from "../../config/scaling/general-pattern-scale.config"
import { Injectable } from "@nestjs/common"
import { BonusInItem } from "src/modules/bonus/types/bonus-in-item.type"

@Injectable()
export class RandomImplicitBonusService {

     /**
     * Actualiza los valores de los bonus implícitos aleatorios de un ítem.
     *
     * El valor final de cada bonus se calcula según:
     * - El nivel requerido del ítem.
     * - El tier implícito correspondiente a ese nivel.
     * - El tipo de bonus.
     * - El nivel de mejora del ítem.
     *
     * Si no se reciben bonus, devuelve una lista vacía.
     *
     * @param lvReq Nivel requerido del ítem.
     * @param bonuses Lista de bonus implícitos aleatorios a actualizar.
     * @param upgradeLv Nivel de mejora actual del ítem.
     *
     * @returns Lista de bonus con sus valores recalculados.
     */
    getRandomImplicitBonusValue(
        lvReq: number,
        bonuses: BonusInItem[] = [],
        upgradeLv: UpgradeLv
    ): BonusInItem[] {

        const updatedBonus: BonusInItem[] = []
        const tierBonus = this.getTierByLvReq(lvReq)

        for (const bonus of bonuses) {
            const pattern = this.getBonusValuePattern(tierBonus, bonus.bonusRef)
            const value = PATTERN_SCALE_CONFIG[pattern][upgradeLv]

            if (value === undefined) {
                throw new Error(`No se encuentra el valor para pattern ${pattern} y upgrade ${upgradeLv}`)
            }

            updatedBonus.push({ ...bonus, bonusValue: value })
        }

        return updatedBonus
    }


    private getBonusValuePattern(
        tier: ImplicitBonusTierType,
        bonusRefKey: BonusRefKeys
    ): PatternScaleType {
        const config = RANDOM_IMPLICIT_BONUS_CONFIG.possibleBonus.find(c => c.bonusRef === bonusRefKey)

        if (!config) {
            throw new Error(`No se encuentra la config para el bonus ${bonusRefKey}`)
        }

        const bonusValueConfig = config.tierValue.find(tierValue => tierValue.tier === tier)

        if (!bonusValueConfig) {
            throw new Error(`No se encuentra el pattern del tier ${tier}`)
        }

        return bonusValueConfig.pattern
    }



    private getTierByLvReq(lvReq: number): ImplicitBonusTierType {
        const rule = IMPLICIT_BONUS_TIER_BY_LV_REQ.find(rule => lvReq <= rule.maxLv)

        if (!rule) {
            throw new Error(`No existe tier para lvReq ${lvReq}`)
        }

        return rule.tier
    }
}