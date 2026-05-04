import { Injectable } from "@nestjs/common";
import { BonusType } from "../types/bonusListHelper/bonus.type";
import { BonusInItem } from "../types/bonus-in-item.type";
import { MEDIA_HABILIDAD_ROLL_CONFIG } from "../config/media-habilidad-roll.config.";
import { SpecialBonus, TierConfigs } from "../types/media-habilidad-roll-config.type";
import { randomNumberInRange } from "src/modules/shared/functions/random-number-in-range.function";
import { BONUS_LIST } from "../const/bonus-list.cons";

@Injectable()
export class SpecialBonusService {

    isSpecialBonus(bonus: BonusType): boolean {
        return bonus.name.bonus_ref_name === 'media' || bonus.name.bonus_ref_name === 'habilidad'
    }

    generateSpecialBonuses(bonus: BonusType): BonusInItem[] {
        if (!this.isSpecialBonus(bonus)) {
            throw new Error('No se un bonus especial')
        }

        const tierBonus = this.getTierOfBonus(bonus.name.bonus_ref_name as SpecialBonus)

        const bonusValue = randomNumberInRange(tierBonus.minValue, tierBonus.maxValue)
        const mainBonus = {
            bonusFullName: bonus.name.full_name,
            bonusRef: bonus.name.bonus_ref_name,
            bonusValueType: bonus.name.type_value,
            bonusValue
        }

        const counterBonus = this.getCounterBonus(tierBonus.tier, bonus.name.bonus_ref_name as SpecialBonus)

        return [mainBonus, counterBonus]
    }

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

        const value = -Number(randomNumberInRange(tierBonus.minValue, tierBonus.maxValue))

        return {
            bonusFullName: baseInfoOfBonus.name.full_name,
            bonusRef: counterBonusRef,
            bonusValue: value,
            bonusValueType: baseInfoOfBonus.name.type_value
        }
    }
} 