import { Injectable } from "@nestjs/common";
import { EquipType } from "src/modules/item/types/entities-props/equip.type";
import { MobModel } from "src/modules/mob/schema/mob.schema";
import { RARE_BONUS_QUANTITY_MULTIPLIER, RARE_QUALITY_MULTIPLIER, RARE_UPGRADE_MULTIPLIER } from "../config/equip/equip-item-rarity-multiplier.config";
import { RngService } from "src/modules/shared/services/rng.service";
import { EQUIP_ITEM_DROP_GENERATION_CONFIG } from "../config/equip/equip-item-drop-generation.config";
import { BonusService } from "src/modules/bonus/bonus.service";
import { ItemService } from "src/modules/item/item.service";

@Injectable()
export class EquipItemDropService {
    constructor(
        private rngService: RngService,
        private bonusService: BonusService,
        private ItemService: ItemService
    ) {}

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

        const upgradeChance = this.applyRareFrequencyBonus(
            config.upgradeChance,
            RARE_UPGRADE_MULTIPLIER,
            rareBonusValue,
        )

        const quality = this.rngService.pickWeightedResult(qualityChance)
        const quantityBonus = Number(this.rngService.pickWeightedResult(quantityBonusChance))
        const upgradeLv = Number(this.rngService.pickWeightedResult(upgradeChance))


    }

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