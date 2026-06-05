import { Injectable } from "@nestjs/common";
import { UtilityItemDTO } from "src/modules/item/types/item-dto";
import { MobModel } from "src/modules/mob/schema/mob.schema";
import { RngService } from "src/modules/shared/services/rng.service";

@Injectable()
export class UtilityItemDropService {
    constructor(
        private rngService: RngService
    ){}

    /**
    * Genera la versión final de un ítem de utilidad al momento
    * de ser dropeado.
    *
    * Aplica todas las modificaciones dinámicas relacionadas con
    * la generación del drop, como:
    * - cantidad obtenida
    * - escalado por nivel del mob
    * - bonificaciones de rareza
    *
    * @param baseItem Ítem base seleccionado del pool de drops.
    * @param mob Mob que generó el drop.
    * @param rareBonusValue Valor de frecuencia de objetos raros
    * aplicado al jugador.
    *
    * @returns Copia del ítem con sus valores finales de drop.
    */
    generateFinalItem(baseItem: UtilityItemDTO, mob: MobModel, rareBonusValue: number): UtilityItemDTO {
        const item = structuredClone(baseItem)

        if (!item.itemDropConfig?.quantity) {
            return {
                ...item,
                cantidad: 1,
            }
        }

        const cantidad = this.calculateQuantity(
            item.itemDropConfig.quantity,
            item.itemDropConfig.levelScaling,
            mob,
            rareBonusValue,
        )

        return {
            ...item,
            cantidad,
        }
    }

    /**
    * Calcula la cantidad final de unidades que serán obtenidas
    * al dropear un ítem de utilidad.
    *
    * Puede aplicar:
    * - escalado por nivel del mob
    * - bonificaciones de rareza
    * - límites mínimo y máximo configurados
    *
    * @param quantityConfig Configuración base de cantidad.
    * @param levelScaling Configuración de escalado por nivel.
    * @param mob Mob que generó el drop.
    * @param rareBonusValue Valor de frecuencia de objetos raros.
    *
    * @returns Cantidad final generada para el ítem.
    */
    private calculateQuantity(
        quantityConfig: {
            min: number
            max: number
            scaleWithMobLv: boolean
        } | undefined,
        levelScaling: {
            startLv: number
            maxBonusLv: number
            maxMultiplier: number
        } | undefined,
        mob: MobModel,
        rareBonusValue: number,
    ): number {
        if (!quantityConfig || quantityConfig.max === 1) {
            return 1
        }

        let minQuantity = quantityConfig.min
        let maxQuantity = quantityConfig.max

        if (quantityConfig.scaleWithMobLv && levelScaling) {
            const multiplier = this.getLevelScalingMultiplier(levelScaling, mob.lv)

            minQuantity = Math.max(1, Math.round(minQuantity * multiplier))
            maxQuantity = Math.max(minQuantity, Math.round(maxQuantity * multiplier))
        }

        const quantityWeights = this.buildQuantityWeights(
            minQuantity,
            maxQuantity,
            rareBonusValue,
        )

        return Number(this.rngService.pickWeightedResult(quantityWeights))
    }

    /**
    * Obtiene el multiplicador de cantidad según el nivel del mob.
    *
    * El escalado comienza a partir de `startLv` y aumenta
    * progresivamente hasta alcanzar `maxMultiplier`
    * en `maxBonusLv`.
    *
    * Ejemplo:
    * - startLv = 10
    * - maxBonusLv = 50
    * - maxMultiplier = 2
    *
    * Un mob de nivel 50 o superior obtendrá el multiplicador máximo.
    *
    * @param levelScaling Configuración de escalado.
    * @param mobLv Nivel actual del mob.
    *
    * @returns Multiplicador de cantidad calculado.
    */
    private getLevelScalingMultiplier(
        levelScaling: {
            startLv: number
            maxBonusLv: number
            maxMultiplier: number
        },
        mobLv: number,
    ): number {

        if (mobLv <= levelScaling.startLv) {
            return 1
        }

        const progress = Math.min(
            (mobLv - levelScaling.startLv) /
            (levelScaling.maxBonusLv - levelScaling.startLv),
            1,
        )

        return 1 + progress * (levelScaling.maxMultiplier - 1)
    }

    /**
    * Construye una tabla de pesos para determinar la cantidad
    * final obtenida de un ítem.
    *
    * Las cantidades más altas reciben una bonificación progresiva
    * cuando el jugador posee frecuencia de objetos raros,
    * aumentando la probabilidad de obtener valores cercanos
    * al máximo permitido.
    *
    * Ejemplo:
    * - Cantidades posibles: 1 a 5
    * - Frecuencia rara: 50%
    *
    * La cantidad 5 tendrá más peso que la cantidad 1.
    *
    * @param min Cantidad mínima posible.
    * @param max Cantidad máxima posible.
    * @param rareBonusValue Valor de frecuencia de objetos raros.
    *
    * @returns Tabla de pesos utilizada para la selección aleatoria.
    */
    private buildQuantityWeights(
        min: number,
        max: number,
        rareBonusValue: number,
    ): Partial<Record<string, number>> {

        const weights: Partial<Record<string, number>> = {}

        for (let quantity = min; quantity <= max; quantity++) {
            const progress = max === min
                ? 0
                : (quantity - min) / (max - min)

            const rareMultiplier = 1 + progress * (rareBonusValue / 100)

            weights[String(quantity)] = Math.round(100 * rareMultiplier)
        }

        return weights
    }
}