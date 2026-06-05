import { EnemyType } from "src/modules/mob/types/mobProps/enemie-type.type";
import { MobDifficulty } from "src/modules/mob/types/mobProps/mob-difficult.type";
import { ItemDropGenerationConfig } from "../../types/item-drop-generation.type";

/**
 * Configuración de generación de equipamiento obtenido mediante drops.
 *
 * Define cómo se generan los atributos aleatorios de un ítem de equipamiento
 * según:
 *
 * - El tipo de enemigo (`mob`, `netim`, `boss`, `raid`).
 * - La dificultad del enemigo (`1`, `2`, `3`).
 *
 * Esta configuración es utilizada después de seleccionar un equipamiento
 * del pool de drops y determina las características finales del objeto.
 */
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
        },
    },
}