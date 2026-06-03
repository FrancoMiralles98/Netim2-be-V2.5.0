import { DropWeightType } from "../../types/drop-weight.type";

export const RARE_DROP_MULTIPLIER: Partial<Record<DropWeightType, number>> = {
    UNCOMMON: 1.2,
    RARE: 1.5,
    VERY_RARE: 2,
    ULTRA_RARE: 3,
}