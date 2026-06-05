import { Injectable } from "@nestjs/common";
import { EquipType } from "src/modules/item/types/entities-props/equip.type";
import { MobModel } from "src/modules/mob/schema/mob.schema";
import { RARE_BONUS_QUANTITY_MULTIPLIER, RARE_QUALITY_MULTIPLIER } from "../config/equip/equip-item-rarity-multiplier.config";
import { RngService } from "src/modules/shared/services/rng.service";
import { EQUIP_ITEM_DROP_GENERATION_CONFIG } from "../config/equip/equip-item-drop-generation.config";
import { BonusService } from "src/modules/bonus/bonus.service";
import { EQUIP_RULES } from "src/modules/item/config/items-rule.const";

@Injectable()
export class EquipItemDropService {
    constructor(
        private rngService: RngService,
        private bonusService: BonusService,
    ) { }

    generateFinalItem(baseItem: EquipType, mob: MobModel, rareBonusValue: number): EquipType {
        const config = EQUIP_ITEM_DROP_GENERATION_CONFIG[mob.enemie_type][mob.dificultad]

        const qualityChance = this.applyRareFrequencyBonus(
            config.qualityChance,
            RARE_QUALITY_MULTIPLIER,
            rareBonusValue,
        )

        const quantityBonusChance = this.applyRareFrequencyBonus(
            config.quantityBonusChance,
            RARE_BONUS_QUANTITY_MULTIPLIER,
            rareBonusValue,
        )

        const quality = this.rngService.pickWeightedResult(qualityChance)
        const quantityBonus = Number(this.rngService.pickWeightedResult(quantityBonusChance))

        const explicitBonus = this.bonusService.generatorBonus(
            'generic',
            [], baseItem.itemLv,
            quality,
            EQUIP_RULES.MAX_EXPLICIT_BONUS,
            'random',
            quantityBonus
        )

        return baseItem

    }

    /**
    * Aplica un bonus de frecuencia sobre una tabla de pesos ponderados.
    *
    * Permite aumentar progresivamente la frecuencia de aparición de
    * determinados resultados según una configuración de multiplicadores
    * y el valor de frecuencia rara proporcionado.
    *
    * El método es genérico y puede utilizarse para:
    * - Calidad de equipamiento (`normal`, `magic`, `rare`, etc.).
    * - Cantidad de bonus explícitos.
    *
    * Funcionamiento:
    *
    * - Si `rareBonusValue` es 0, los pesos permanecen sin cambios.
    * - Si `rareBonusValue` es 100, se aplica el multiplicador completo
    *   definido en `multiplierConfig`.
    * 
    * @typeParam T Tipo de clave utilizada por la tabla de pesos.
    *
    * @param weights Tabla de pesos original.
    * @param multiplierConfig Multiplicadores aplicables a cada resultado.
    * @param rareBonusValue Valor de frecuencia rara expresado en porcentaje.
    *
    * @returns Nueva tabla de pesos con los modificadores aplicados.
    */
    private applyRareFrequencyBonus<T extends string | number>(
        weights: Partial<Record<T, number>>,
        multiplierConfig: Partial<Record<T, number>>,
        rareBonusValue: number,
    ): Partial<Record<T, number>> {
        const updatedWeights = { ...weights }

        for (const [key, multiplier] of Object.entries(multiplierConfig) as Array<[T, number]>) {
            const currentWeight = updatedWeights[key]

            if (currentWeight === undefined) {
                continue
            }

            updatedWeights[key] = currentWeight * (1 + ((multiplier - 1) * rareBonusValue / 100))
        }

        return updatedWeights
    }
}