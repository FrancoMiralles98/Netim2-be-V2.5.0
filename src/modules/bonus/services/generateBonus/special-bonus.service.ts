import { Injectable } from '@nestjs/common';
import { BonusInItem, BonusType } from 'netim2-shared';
import { MEDIA_HABILIDAD_ROLL_CONFIG } from '../../config/media-habilidad-roll.config.';
import { SpecialBonus, TierConfigs } from '../../types/media-habilidad-roll-config.type';
import { BONUS_LIST } from '../../const/bonus-list.cons';
import { RngService } from '../../../shared/services/rng.service';

/** Genera el par media/habilidad sin escalar; el generador aplica itemLv al final. */
@Injectable()
export class SpecialBonusService {
    constructor(private rngService: RngService) {}

    isSpecialBonus(bonus: BonusType): boolean {
        return bonus.bonus_ref_name === 'media' || bonus.bonus_ref_name === 'habilidad';
    }

    generateSpecialBonuses(bonus: BonusType): BonusInItem[] {
        if (!this.isSpecialBonus(bonus) || bonus.category.type !== 'generic') {
            throw new Error('El bonus debe ser media o habilidad de categoría generic');
        }

        const ref = bonus.bonus_ref_name as SpecialBonus;
        const rollTier = this.getTierOfBonus(ref);
        const mainBonus: BonusInItem = {
            bonusFullName: bonus.full_name,
            bonusRef: ref,
            category: bonus.category,
            effects: bonus.effects,
            bonusValue: this.rngService.randomNumberInRange(rollTier.minValue, rollTier.maxValue),
            origin: 'random',
        };
        return [mainBonus, this.getCounterBonus(rollTier.tier, bonus)];
    }

    private getTierOfBonus(ref: SpecialBonus): TierConfigs {
        const rolls = MEDIA_HABILIDAD_ROLL_CONFIG[ref];
        const total = rolls.reduce((sum, roll) => sum + roll.probability, 0);
        const random = this.rngService.randomNumberInRange(0, total, true);
        let accumulated = 0;
        for (const roll of rolls) {
            accumulated += roll.probability;
            if (random < accumulated) {
                return roll;
            }
        }
        throw new Error('No se pudo seleccionar el tier de media/habilidad');
    }

    /** Usa el tier interno sorteado, sin volver a sortear la probabilidad. */
    private getCounterBonus(rollTier: number, mainBonus: BonusType): BonusInItem {
        const ref: SpecialBonus = mainBonus.bonus_ref_name === 'media' ? 'habilidad' : 'media';
        const category = mainBonus.category;
        const counterpart = BONUS_LIST.find(bonus =>
            bonus.bonus_ref_name === ref &&
            category.type === 'generic' &&
            bonus.category.type === 'generic' &&
            bonus.category.tier === category.tier,
        );
        if (!counterpart) {
            throw new Error('No se encuentra el bonus correspondiente');
        }
        const range = MEDIA_HABILIDAD_ROLL_CONFIG[ref].find(roll => roll.tier === rollTier);
        if (!range) {
            throw new Error(`No existe configuración para el tier ${rollTier}`);
        }
        return {
            bonusFullName: counterpart.full_name,
            bonusRef: ref,
            category: counterpart.category,
            effects: counterpart.effects,
            bonusValue: -this.rngService.randomNumberInRange(range.minValue, range.maxValue),
            origin: 'random',
        };
    }
}
