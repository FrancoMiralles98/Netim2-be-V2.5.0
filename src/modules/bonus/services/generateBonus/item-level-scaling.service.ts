import { Injectable } from '@nestjs/common';
import { FULL_VALUE_ITEM_LV, MAX_MULTIPLIER, MIN_MULTIPLIER, SCALING_PER_ITEM_LV } from '../../config/item-lv-bonus-scaling.config';

@Injectable()
export class ItemLevelScalingService {
    /** Escala un roll ya elegido, conservando su signo y una magnitud mínima de 1. */
    applyItemLevelScalingToBonus(value: number, itemLv: number): number {
        if (value === 0) {
            return 0;
        }
        const multiplier = this.getItemLvBonusMultiplier(itemLv);
        const magnitude = Math.abs(value) * multiplier;
        // Evita truncar 1004.9999999999999 a 1004 cuando el resultado es 1005.
        const scaled = Math.floor(magnitude + Number.EPSILON * magnitude);
        return Math.sign(value) * Math.max(1, scaled);
    }

    /** Nivel 1: 50 %; nivel 100: 100 %; nivel 110: 105 %, sin techo superior. */
    private getItemLvBonusMultiplier(itemLv: number): number {
        if (itemLv <= 1) {
            return MIN_MULTIPLIER;
        }
        return Math.max(
            MIN_MULTIPLIER,
            MAX_MULTIPLIER + (itemLv - FULL_VALUE_ITEM_LV) * SCALING_PER_ITEM_LV,
        );
    }
}
