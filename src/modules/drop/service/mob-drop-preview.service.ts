import { Injectable } from '@nestjs/common';
import type { DropRange, IdItemList, MobDropPreview, MobType, Stats } from 'netim2-shared';
import { ItemService } from '../../item/item.service';
import { DROP_CONFIG_BY_ENEMY_TYPE } from '../config/drop/drop-difficulty.config';
import { ItemDropService } from './item-drop.service';
import { MicsBonusService } from './miscs-bonus.service';
import { UtilityItemDropService } from './utility-item-drop.service';

/** Consulta los drops posibles de un mob con los bonus del personaje, sin realizar sorteos. */
@Injectable()
export class MobDropPreviewService {
    constructor(
        private readonly itemDropService: ItemDropService,
        private readonly utilityDropService: UtilityItemDropService,
        private readonly miscsBonusService: MicsBonusService,
        private readonly itemService: ItemService,
    ) {}

    /** Devuelve los ítems y el yang con sus chances actuales y su cambio respecto al mob sin bonus. */
    getMobDropPreview(mob: MobType, bonus: Stats['bonus']['miscs']): MobDropPreview {
        const { attempts } = DROP_CONFIG_BY_ENEMY_TYPE[mob.enemie_type][mob.dificultad];
        const probabilities = this.getAttemptProbabilities(mob, bonus);
        const baseProbabilities = this.getAttemptProbabilities(mob, {
            ...bonus, chances_objetos: 0, chances_raros: 0, chances_yang: 0,
        });
        const itemIds = new Set([...probabilities.items.keys(), ...baseProbabilities.items.keys()]);

        const drops = Array.from(itemIds, (itemId): MobDropPreview[number] => {
            const item = this.itemService.getCoreItemInfoByIdItem(itemId);
            const dropConfig = item.itemDropConfig;
            if (!dropConfig) throw new Error(`El ítem ${itemId} no tiene configuración de drop`);
            const perAttempt = probabilities.items.get(itemId) ?? 0;
            const basePerAttempt = baseProbabilities.items.get(itemId) ?? 0;
            const chances = {
                chancePerAttempt: perAttempt * 100,
                chancePerKill: this.getProbabilityPerKill(perAttempt, attempts) * 100,
                chanceChange: this.getChanceChange(perAttempt, basePerAttempt),
                dropWeight: dropConfig.weight,
            };

            if (item.type === 'equip') {
                return {
                    type: item.type, item, ...chances,
                    upgradeLvRange: { min: item.upgradeLv, max: item.upgradeLv },
                };
            }
            return {
                type: item.type, item, ...chances,
                quantityRange: this.utilityDropService.getQuantityRange(item, mob, bonus.chances_raros),
            };
        });
        drops.push({
            type: 'yang',
            chancePerAttempt: probabilities.yang * 100,
            chancePerKill: this.getProbabilityPerKill(probabilities.yang, attempts) * 100,
            chanceChange: this.getChanceChange(probabilities.yang, baseProbabilities.yang),
        });
        return drops;
    }

    /** Calcula las chances por intento, incluyendo la nueva tirada de yang cuando no existen ítems. */
    private getAttemptProbabilities(mob: MobType, bonus: Stats['bonus']['miscs']): {
        items: Map<IdItemList, number>;
        yang: number;
    } {
        const config = DROP_CONFIG_BY_ENEMY_TYPE[mob.enemie_type][mob.dificultad];
        const { item, yang, nothing } = this.miscsBonusService.applyItemDropAndYangChanceBonus(config.resultChances, bonus);
        const totalWeight = item + yang + nothing;
        if (totalWeight <= 0) return { items: new Map(), yang: 0 };

        const itemRollProbability = item / totalWeight;
        const probabilities = item > 0
            ? this.itemDropService.getItemProbabilities(mob, bonus.chances_raros)
            : new Map<IdItemList, number>();
        for (const [itemId, probability] of probabilities) {
            probabilities.set(itemId, Math.min(1, itemRollProbability * probability));
        }
        const fallbackWeight = nothing + yang;
        const fallbackProbability = !probabilities.size && fallbackWeight > 0
            ? itemRollProbability * yang / fallbackWeight : 0;
        return { items: probabilities, yang: yang / totalWeight + fallbackProbability };
    }

    /** Compara probabilidades tolerando diferencias mínimas de precisión numérica. */
    private getChanceChange(current: number, base: number): MobDropPreview[number]['chanceChange'] {
        const difference = current - base;
        if (Math.abs(difference) <= Number.EPSILON * 4) return 'unchanged';
        return difference > 0 ? 'increased' : 'decreased';
    }

    /** Promedia la probabilidad de al menos un éxito para cada cantidad posible de intentos. */
    private getProbabilityPerKill(perAttempt: number, attempts: DropRange): number {
        let total = 0;
        for (let count = attempts.min; count <= attempts.max; count++) {
            total += 1 - (1 - perAttempt) ** count;
        }
        return total / (attempts.max - attempts.min + 1);
    }
}
