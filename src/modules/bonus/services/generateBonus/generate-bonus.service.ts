import { Injectable } from '@nestjs/common';
import { BonusCategory, BonusInItem, BonusTierLv, BonusType, ItemBonusQuality, subTypeEquip } from 'netim2-shared';
import { SpecialBonusService } from './special-bonus.service';
import { ItemLevelScalingService } from './item-level-scaling.service';
import { RngService } from 'src/modules/shared/services/rng.service';
import { TIER_BONUS_PROBABILITIES_X_QUALITY } from '../../config/tier-bonus-probabilites.config';
import { BONUS_LIST } from '../../const/bonus-list.cons';


/** Genera bonus únicos y válidos para el equipo, escalados al nivel del ítem. */
@Injectable()
export class GenerateBonusService {
    constructor(
        private specialBonusService: SpecialBonusService,
        private itemLevelScalingService: ItemLevelScalingService,
        private rngService: RngService,
    ) {}

    /** Retorna un bonus, o el par positivo/negativo de media y habilidad. */
    generateBonus(
        category: BonusCategory,
        bonusUsed: BonusInItem[] = [],
        itemLv: number,
        quality: ItemBonusQuality = 'normal',
        sub_type_equip: subTypeEquip,
    ): BonusInItem[] {
        const availableBonuses = this.getBonusListByCategory(category, bonusUsed, sub_type_equip);

        if (availableBonuses.length === 0) {
            throw new Error('No hay bonus disponibles para esta categoría y equipo');
        }

        let bonuses: BonusInItem[];
        switch (category.type) {
            case 'generic':
                bonuses = this.generateGenericBonus(availableBonuses, quality);
                break;
            case 'corrupt':
                bonuses = this.generateCorruptBonus(availableBonuses);
                break;
            case 'bonus6_7':
                bonuses = this.generateBonus6_7(availableBonuses);
                break;
        }

        return bonuses.map(bonus => {
            if (typeof bonus.bonusValue !== 'number') {
                throw new Error('El valor del bonus generado debe ser de tipo number');
            }
            return {
                ...bonus,
                bonusValue: this.itemLevelScalingService.applyItemLevelScalingToBonus(bonus.bonusValue, itemLv),
            };
        });
    }

    private generateGenericBonus(availableBonuses: BonusType[], quality: ItemBonusQuality): BonusInItem[] {
        const selectedTier = this.pickBonusTier(quality);
        const candidates = this.selectTierBonusList(selectedTier, availableBonuses);
        const bonus = this.selectRandomBonusOfList(candidates);

        if (this.specialBonusService.isSpecialBonus(bonus)) {
            return this.specialBonusService.generateSpecialBonuses(bonus);
        }
        return [this.rollBonus(bonus)];
    }

    private generateCorruptBonus(availableBonuses: BonusType[]): BonusInItem[] {
        return [this.rollBonus(this.selectRandomBonusOfList(availableBonuses))];
    }

    private generateBonus6_7(availableBonuses: BonusType[]): BonusInItem[] {
        return [this.rollBonus(this.selectRandomBonusOfList(availableBonuses))];
    }

    /** Obtiene el valor base antes de aplicar el escalado por itemLv. */
    private rollBonus(bonus: BonusType): BonusInItem {
        return {
            bonusFullName: bonus.full_name,
            bonusRef: bonus.bonus_ref_name,
            category: bonus.category,
            effects: bonus.effects,
            bonusValue: this.rngService.randomNumberInRange(bonus.values.min, bonus.values.max),
            origin: 'random',
        };
    }

    private pickBonusTier(quality: ItemBonusQuality): BonusTierLv {
        const tiers = Object.entries(TIER_BONUS_PROBABILITIES_X_QUALITY[quality]).map(
            ([tier, probability]) => ({ tier: Number(tier) as BonusTierLv, probability }),
        );
        // Roll decimal: las tablas pueden contener probabilidades fraccionarias.
        const total = tiers.reduce((sum, entry) => sum + entry.probability, 0);
        const roll = this.rngService.randomNumberInRange(0, total, true);
        let accumulated = 0;
        for (const entry of tiers) {
            accumulated += entry.probability;
            if (roll < accumulated) {
                return entry.tier;
            }
        }
        throw new Error('No se pudo seleccionar un tier de bonus');
    }

    private getBonusListByCategory(
        category: BonusCategory,
        bonusUsed: BonusInItem[],
        sub_type_equip: subTypeEquip,
    ): BonusType[] {
        const usedRefs = new Set(bonusUsed.map(bonus => bonus.bonusRef));
        const hasSpecialPair = usedRefs.has('media') || usedRefs.has('habilidad');

        return BONUS_LIST.filter(bonus => {
            if (bonus.category.type !== category.type) {
                return false;
            }
            if (category.type === 'corrupt' &&
                bonus.category.type === 'corrupt' &&
                bonus.category.sub_type !== category.sub_type) {
                return false;
            }
            // El tier genérico se sortea después; no se toma el tier del argumento.
            if (!bonus.valid.includes(sub_type_equip) || usedRefs.has(bonus.bonus_ref_name)) {
                return false;
            }
            if (hasSpecialPair && this.specialBonusService.isSpecialBonus(bonus)) {
                return false;
            }
            return true;
        });
    }

    private selectRandomBonusOfList(list: BonusType[]): BonusType {
        if (list.length === 0) {
            throw new Error('No se encuentra un bonus para usar');
        }
        return list[this.rngService.randomNumberInRange(0, list.length - 1)];
    }

    /** Conserva el fallback: primero tiers superiores, luego inferiores. */
    private selectTierBonusList(selectedTier: BonusTierLv, availableBonuses: BonusType[]): BonusType[] {
        const tierOrder: number[] = [];
        for (let tier = selectedTier; tier <= 4; tier++) {
            tierOrder.push(tier);
        }
        for (let tier = selectedTier - 1; tier >= 1; tier--) {
            tierOrder.push(tier);
        }
        for (const tier of tierOrder) {
            const candidates = availableBonuses.filter(
                bonus => bonus.category.type === 'generic' && bonus.category.tier === tier,
            );
            if (candidates.length > 0) {
                return candidates;
            }
        }
        throw new Error('No se encontró ningún bonus disponible');
    }
}
