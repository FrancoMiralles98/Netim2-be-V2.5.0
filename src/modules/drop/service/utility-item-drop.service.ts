import { Injectable } from "@nestjs/common";
import type { DropRange, UtilityItemDTO } from "netim2-shared";
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

        const quantity = item.itemDropConfig?.quantity
        if (!quantity || quantity.max === 1) return { ...item, cantidad: 1 }

        const weights = this.getQuantityWeights(item, mob, rareBonusValue)
        return { ...item, cantidad: Number(this.rngService.pickWeightedResult(weights)) }
    }

    /** Devuelve las cantidades mínima y máxima con peso positivo. */
    getQuantityRange(item: UtilityItemDTO, mob: MobModel, rareBonusValue: number): DropRange {
        const quantities = Object.keys(this.getQuantityWeights(item, mob, rareBonusValue)).map(Number)
        return { min: quantities[0], max: quantities[quantities.length - 1] }
    }

    /** Construye los mismos pesos que se usan para sortear la cantidad del drop. */
    private getQuantityWeights(item: UtilityItemDTO, mob: MobModel, rareBonusValue: number): Record<string, number> {
        const quantity = item.itemDropConfig?.quantity
        const levelScaling = item.itemDropConfig?.levelScaling
        if (!quantity || quantity.max === 1) return { 1: 100 }

        let { min, max } = quantity
        if (quantity.scaleWithMobLv && levelScaling) {
            const multiplier = this.getLevelScalingMultiplier(levelScaling, mob.lv)
            min = Math.max(1, Math.round(min * multiplier))
            max = Math.max(min, Math.round(max * multiplier))
        }

        return this.buildQuantityWeights(min, max, rareBonusValue)
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
    ): Record<string, number> {

        const weights: Record<string, number> = {}

        for (let quantity = min; quantity <= max; quantity++) {
            const progress = max === min
                ? 0
                : (quantity - min) / (max - min)

            const rareMultiplier = 1 + progress * (rareBonusValue / 100)

            const weight = Math.round(100 * rareMultiplier)
            if (weight > 0) weights[quantity] = weight
        }

        if (!Object.keys(weights).length) throw new Error('El drop no tiene cantidades con peso positivo')
        return weights
    }
}
