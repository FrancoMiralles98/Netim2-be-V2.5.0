import { UNIQUE_ID_SKILLS } from "../props/unique-id-skill.enum"

export type BonusDamageConfigType = Partial<Record<UNIQUE_ID_SKILLS, ChanceDescription | TierBonusDamageDescription>>


export interface TierBonusDamageDescription {
    type: 'tier';
    tiers: TierDescription[]
}

export interface TierDescription {
    tier: 1 | 2 | 3 | 4,
    damageConfig: {
        damage_x2?: { chance: number, multi: number },
        damage_x3?: { chance: number, multi: number },
        damage_x4?: { chance: number, multi: number };
        damage_x5?: { chance: number, multi: number };
    }
}

export interface ChanceDescription {
    type: 'chance';
    baseChance: number;
    chancePerLv: number;
    multi: number;
}