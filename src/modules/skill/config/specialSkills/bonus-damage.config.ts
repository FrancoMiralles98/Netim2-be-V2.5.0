import { BonusDamageConfigType } from "../../types/bonus-damage-config.type";

export const BONUS_DAMAGE_CONFIG: BonusDamageConfigType = {
    23: {
        // emboscada
        type: 'chance',
        baseChance: 10,
        chancePerLv: 1,
    },
    24: {
        // daga rodante
        type: 'tier',
        tiers: [
            {
                tier: 1,
                damageConfig: {
                    damage_x2: { chance: 30, multi: 2 },
                    damage_x3: { chance: 16, multi: 3 },
                },
            },
            {
                tier: 2,
                damageConfig: {
                    damage_x2: { chance: 38, multi: 2 },
                    damage_x3: { chance: 21, multi: 3 },
                },
            },
            {
                tier: 3,
                damageConfig: {
                    damage_x2: { chance: 44, multi: 2 },
                    damage_x3: { chance: 26, multi: 3 },
                },
            },
            {
                tier: 4,
                damageConfig: {
                    damage_x2: { chance: 44, multi: 2 },
                    damage_x3: { chance: 30, multi: 3 },
                },
            },
        ],
    },
    31: {
        // lluvia de flechas
        type: 'tier',
        tiers: [
            {
                tier: 1,
                damageConfig: {
                    damage_x2: { chance: 31, multi: 2 },
                    damage_x3: { chance: 0, multi: 3 },
                    damage_x4: { chance: 0, multi: 4 },
                    damage_x5: { chance: 0, multi: 5 },
                },
            },
            {
                tier: 2,
                damageConfig: {
                    damage_x2: { chance: 31, multi: 2 },
                    damage_x3: { chance: 15, multi: 3 },
                    damage_x4: { chance: 0, multi: 4 },
                    damage_x5: { chance: 0, multi: 5 },
                },
            },
            {
                tier: 3,
                damageConfig: {
                    damage_x2: { chance: 31, multi: 2 },
                    damage_x3: { chance: 15, multi: 3 },
                    damage_x4: { chance: 7, multi: 4 },
                    damage_x5: { chance: 0, multi: 5 },
                },
            },
            {
                tier: 4,
                damageConfig: {
                    damage_x2: { chance: 31, multi: 2 },
                    damage_x3: { chance: 15, multi: 3 },
                    damage_x4: { chance: 7, multi: 4 },
                    damage_x5: { chance: 4, multi: 5 },
                },
            },
        ],
    },
};