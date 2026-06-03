import { CharacterStats } from "src/modules/character/types/baseCharacterProps/character-stats.type"
import { MISCS_BONUS_CONFIG } from "../config/bonus-config"
import { DropDifficultyConfig } from "../types/drop.dificult.type"
import { RngService } from "src/modules/shared/services/rng.service"
import { Injectable } from "@nestjs/common"
import { DropTag } from "src/modules/item/types/entities-props/item-drop.config.type"
import { RARE_DROP_TAGS } from "../config/drop/rare-drop-tags.config"

@Injectable()
export class MicsBonusService {
    constructor(
        private rngService: RngService
    ) { }

    applyRareDropTagBonus(
        tagWeights: Partial<Record<DropTag, number>>,
        bonusValue: number
    ): Partial<Record<DropTag, number>> {

        const updated = { ...tagWeights }

        for (const tag of RARE_DROP_TAGS) {
            if (!updated[tag]) {
                continue
            }
            updated[tag] = Math.round(updated[tag] * (1 + bonusValue / 100))
        }

        return updated
    }

    calculateYang(
        bonus: CharacterStats['bonus']['miscs'],
        yang: { min: number, max: number }
    ): number {
        return this.calculateReward(
            yang,
            bonus.bonus_yang,
            bonus.chances_yang,
            MISCS_BONUS_CONFIG.chances_yang
        )
    }

    calculateExp(
        bonus: CharacterStats['bonus']['miscs'],
        exp: { min: number, max: number }
    ): number {
        return this.calculateReward(
            exp,
            bonus.bonus_exp,
            bonus.chances_exp,
            MISCS_BONUS_CONFIG.chances_exp
        )
    }

    applyItemDropChanceBonus(
        chances: DropDifficultyConfig['resultChances'],
    ): DropDifficultyConfig['resultChances'] {

        const itemBonus = Math.min(chances.nothing, MISCS_BONUS_CONFIG.chances_objetos)

        return {
            nothing: chances.nothing - itemBonus,
            yang: chances.yang,
            item: chances.item + itemBonus,
        }
    }

    /**
    * Calcula una recompensa escalable que puede ser Yang o EXP
    * aplicando bonus porcentuales permanentes y bonus
    * adicionales activados por probabilidad.
    *
    * Flujo:
    * - Obtiene un valor base aleatorio dentro del rango indicado.
    * - Aplica el bonus porcentual permanente.
    * - Si la tirada de probabilidad es exitosa, aplica un
    *   multiplicador adicional configurado.
    *
    * @param baseRange Rango mínimo y máximo de la recompensa base.
    * @param flatBonus Bonus porcentual permanente aplicado al valor base.
    * @param chanceBonus Probabilidad (%) de activar la recompensa adicional.
    * @param chanceValue Multiplicador adicional expresado en formato decimal.
    *
    * @returns Valor final de la recompensa.
    */
    private calculateReward(
        baseRange: { min: number; max: number },
        flatBonus: number,
        chanceBonus: number,
        chanceValue: number
    ): number {
        const baseValue = this.rngService.randomNumberInRange(baseRange.min, baseRange.max)

        let totalMultiplier = 1

        totalMultiplier += flatBonus / 100

        if (this.rngService.rollChance(chanceBonus)) {
            totalMultiplier += chanceValue
        }

        return Math.trunc(baseValue * totalMultiplier)
    }
}