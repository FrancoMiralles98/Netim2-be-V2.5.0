import { DropWeightType } from "../../types/drop-weight.type";

/**
 * Todos estos valores suman actualmente: 1701, y en porcentaje representa cada uno
 * VERY_COMMON => 58.8%
 * COMMON => 29.4%
 * UNCOMMON => 8.8%
 * RARE => 2.3%
 * VERY_RARE => 0.6%
 * ULTRA_RARE => 0.05%
 */
export const DROP_WEIGHT:Record<DropWeightType,number> = {
    VERY_COMMON: 1000,
    COMMON: 500,
    UNCOMMON: 150,
    RARE: 40,
    VERY_RARE: 10,
    ULTRA_RARE: 1,
}
