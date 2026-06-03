import { ItemBonusQuality } from "src/modules/bonus/types/item-bonus-quaility.type"

export const RARE_QUALITY_MULTIPLIER: Partial<Record<ItemBonusQuality, number>> = {
    rare: 1.3,
    epic: 1.8,
    unique: 2.5,
}

export const RARE_BONUS_QUANTITY_MULTIPLIER: Partial<Record<0 | 1 | 2 | 3 | 4 | 5, number>> = {
    3: 1.3,
    4: 1.8,
    5: 2.5,
}

export const RARE_UPGRADE_MULTIPLIER: Partial<Record<0 | 1 | 2 | 3 | 4 | 5 | 6, number>> = {
    3: 1.2,
    4: 1.5,
    5: 2,
    6: 2.5,
}