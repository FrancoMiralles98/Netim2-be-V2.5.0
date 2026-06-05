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

    /**
    * Aplica el bonus de frecuencia de objetos raros sobre las categorías
    * de drop consideradas especiales.
    *
    * Incrementa el peso de selección de todos los tags definidos en
    * `RARE_DROP_TAGS`, aumentando así la probabilidad relativa de que
    * dichas categorías sean seleccionadas durante la generación de drops.
    *
    * El incremento es proporcional al valor del bonus recibido.
    * Ejemplo:
    *
    * Peso base: 20
    * Bonus rareza: 50%
    * Resultado: 30
    *
    * @param tagWeights Pesos actuales de cada categoría de drop.
    * @param bonusValue Valor de frecuencia de objetos raros.
    */
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

    /**
    * Calcula la cantidad final de yang obtenida por el jugador.
    *
    * El cálculo tiene en cuenta:
    * - El rango base de yang del enemigo.
    * - El bonus permanente de obtención de yang.
    *
    * @param bonus Bonus misceláneos del personaje.
    * @param yang Rango de yang base otorgado por el enemigo.
    *
    * @returns Cantidad final de yang obtenida.
    */
    calculateYang(
        bonus: CharacterStats['bonus']['miscs'],
        yang: { min: number, max: number }
    ): number {
        return this.calculateReward(
            yang,
            bonus.bonus_yang,
        )
    }

    /**
    * Calcula la cantidad final de experiencia obtenida por el jugador.
    *
    * El cálculo tiene en cuenta:
    * - El rango base de experiencia del enemigo.
    * - El bonus permanente de experiencia.
    * - La probabilidad de activar un bonus adicional de experiencia.
    *
    * @param bonus Bonus misceláneos del personaje.
    * @param exp Rango de experiencia base otorgado por el enemigo.
    *
    * @returns Cantidad final de experiencia obtenida.
    */
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

    /**
    * Aplica los bonus de frecuencia de obtención de objetos y yang
    * sobre los pesos base utilizados por el sistema de drops.
    *
    * Ejemplo:
    *
    * Chances base:
    * nothing: 60
    * yang:    25
    * item:    15
    *
    * Bonus:
    * chances_objetos: 20
    * chances_yang: 50
    *
    * Resultado:
    * nothing: 60
    * yang:    38
    * item:    18
    *
    * @note
    * La suma de los pesos resultantes puede superar 100 ya que
    * son utilizados como pesos relativos para una selección
    * ponderada y no como probabilidades porcentuales directas.
    *
    * @param chances Pesos base de los posibles resultados de un intento de drop.
    * @param bonus Bonus misceláneos del personaje.
    *
    * @returns Nueva tabla de pesos con los modificadores aplicados.
    */
    applyItemDropAndYangChanceBonus(
        chances: DropDifficultyConfig['resultChances'],
        bonus: CharacterStats['bonus']['miscs'],
    ): DropDifficultyConfig['resultChances'] {

        return {
            ...chances,
            yang: Math.round(chances.item * (1 + bonus.chances_yang / 100)),
            item: Math.round(chances.item * (1 + bonus.chances_objetos / 100)),
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
        chanceBonus?: number,
        chanceValue?: number
    ): number {
        const baseValue = this.rngService.randomNumberInRange(baseRange.min, baseRange.max)

        let totalMultiplier = 1

        totalMultiplier += flatBonus / 100

        if (chanceBonus !== undefined && chanceValue && this.rngService.rollChance(chanceBonus)) {
            totalMultiplier += chanceValue
        }

        return Math.trunc(baseValue * totalMultiplier)
    }
}