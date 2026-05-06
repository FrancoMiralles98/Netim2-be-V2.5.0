export interface ItemLvRerollType {
    difficulty: number;
    minDistance: number;
    maxDistance: number;
    tier: TierReroll[]
}

export interface TierReroll {
    probability: number;
    minBonusLv: number;
    maxBonusLv: number;

}