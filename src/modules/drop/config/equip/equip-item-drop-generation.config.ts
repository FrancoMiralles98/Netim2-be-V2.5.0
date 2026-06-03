import { EnemyType } from "src/modules/mob/types/mobProps/enemie-type.type";
import { MobDifficulty } from "src/modules/mob/types/mobProps/mob-difficult.type";
import { ItemDropGenerationConfig } from "../../types/item-drop-generation.type";

export const EQUIP_ITEM_DROP_GENERATION_CONFIG: Record<
    EnemyType,
    Record<MobDifficulty, ItemDropGenerationConfig>
> = {
    mob: {
        1: {
            qualityChance: {
                normal: 75,
                magic: 20,
                rare: 4.5,
                epic: 0.5,
                unique: 0,
            },
            quantityBonusChance: {
                0: 60,
                1: 25,
                2: 10,
                3: 4,
                4: 1,
                5: 0,
            },
            upgradeChance: {
                0: 80,
                1: 10,
                2: 5,
                3: 3,
                4: 1.5,
                5: 0.4,
                6: 0.1,
            },
        },

        2: {
            qualityChance: {
                normal: 60,
                magic: 30,
                rare: 8,
                epic: 1.8,
                unique: 0.2,
            },
            quantityBonusChance: {
                0: 45,
                1: 30,
                2: 15,
                3: 7,
                4: 2,
                5: 1,
            },
            upgradeChance: {
                0: 65,
                1: 15,
                2: 8,
                3: 5,
                4: 4,
                5: 2,
                6: 1,
            },
        },

        3: {
            qualityChance: {
                normal: 45,
                magic: 38,
                rare: 13,
                epic: 3.5,
                unique: 0.5,
            },
            quantityBonusChance: {
                0: 30,
                1: 30,
                2: 20,
                3: 12,
                4: 6,
                5: 2,
            },
            upgradeChance: {
                0: 50,
                1: 18,
                2: 10,
                3: 8,
                4: 7,
                5: 5,
                6: 2,
            },
        },
    },

    netim: {
        1: {
            qualityChance: {
                normal: 45,
                magic: 35,
                rare: 15,
                epic: 4.5,
                unique: 0.5,
            },
            quantityBonusChance: {
                0: 25,
                1: 30,
                2: 20,
                3: 15,
                4: 8,
                5: 2,
            },
            upgradeChance: {
                0: 45,
                1: 20,
                2: 12,
                3: 10,
                4: 7,
                5: 4,
                6: 2,
            },
        },

        2: {
            qualityChance: {
                normal: 32,
                magic: 38,
                rare: 22,
                epic: 7,
                unique: 1,
            },
            quantityBonusChance: {
                0: 15,
                1: 25,
                2: 25,
                3: 18,
                4: 12,
                5: 5,
            },
            upgradeChance: {
                0: 35,
                1: 20,
                2: 15,
                3: 12,
                4: 10,
                5: 6,
                6: 2,
            },
        },

        3: {
            qualityChance: {
                normal: 20,
                magic: 38,
                rare: 28,
                epic: 12,
                unique: 2,
            },
            quantityBonusChance: {
                0: 10,
                1: 20,
                2: 25,
                3: 20,
                4: 15,
                5: 10,
            },
            upgradeChance: {
                0: 25,
                1: 20,
                2: 18,
                3: 15,
                4: 10,
                5: 8,
                6: 4,
            },
        },
    },

    boss: {
        1: {
            qualityChance: {
                normal: 20,
                magic: 35,
                rare: 30,
                epic: 13,
                unique: 2,
            },
            quantityBonusChance: {
                0: 10,
                1: 15,
                2: 25,
                3: 25,
                4: 15,
                5: 10,
            },
            upgradeChance: {
                0: 20,
                1: 20,
                2: 20,
                3: 15,
                4: 12,
                5: 8,
                6: 5,
            },
        },

        2: {
            qualityChance: {
                normal: 10,
                magic: 25,
                rare: 35,
                epic: 25,
                unique: 5,
            },
            quantityBonusChance: {
                0: 5,
                1: 10,
                2: 20,
                3: 30,
                4: 20,
                5: 15,
            },
            upgradeChance: {
                0: 10,
                1: 15,
                2: 20,
                3: 20,
                4: 15,
                5: 12,
                6: 8,
            },
        },

        3: {
            qualityChance: {
                normal: 5,
                magic: 15,
                rare: 35,
                epic: 35,
                unique: 10,
            },
            quantityBonusChance: {
                0: 2,
                1: 8,
                2: 15,
                3: 30,
                4: 25,
                5: 20,
            },
            upgradeChance: {
                0: 5,
                1: 10,
                2: 15,
                3: 20,
                4: 20,
                5: 18,
                6: 12,
            },
        },
    },

    raid: {
        1: {
            qualityChance: {
                normal: 5,
                magic: 15,
                rare: 35,
                epic: 35,
                unique: 10,
            },
            quantityBonusChance: {
                0: 0,
                1: 5,
                2: 15,
                3: 30,
                4: 30,
                5: 20,
            },
            upgradeChance: {
                0: 5,
                1: 10,
                2: 15,
                3: 20,
                4: 20,
                5: 18,
                6: 12,
            },
        },

        2: {
            qualityChance: {
                normal: 2,
                magic: 8,
                rare: 30,
                epic: 45,
                unique: 15,
            },
            quantityBonusChance: {
                0: 0,
                1: 2,
                2: 10,
                3: 25,
                4: 33,
                5: 30,
            },
            upgradeChance: {
                0: 2,
                1: 5,
                2: 10,
                3: 18,
                4: 25,
                5: 22,
                6: 18,
            },
        },

        3: {
            qualityChance: {
                normal: 0,
                magic: 5,
                rare: 25,
                epic: 50,
                unique: 20,
            },
            quantityBonusChance: {
                0: 0,
                1: 0,
                2: 5,
                3: 20,
                4: 35,
                5: 40,
            },
            upgradeChance: {
                0: 0,
                1: 3,
                2: 7,
                3: 15,
                4: 25,
                5: 25,
                6: 25,
            },
        },
    },
}