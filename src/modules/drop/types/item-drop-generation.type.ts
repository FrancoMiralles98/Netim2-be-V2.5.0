import { ItemBonusQuality } from "src/modules/bonus/types/item-bonus-quaility.type";

export interface ItemDropGenerationConfig {
    qualityChance: Record<ItemBonusQuality, number>;
    quantityBonusChance: Record<0 | 1 | 2 | 3 | 4 | 5, number>;
    upgradeChance: Record<0 | 1 | 2 | 3 | 4 | 5 | 6, number>;
}