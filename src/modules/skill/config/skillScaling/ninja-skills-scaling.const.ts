import { UNIQUE_ID_SKILLS } from "netim2-shared";
import { StructureSkillScaling } from "../../types/structureSkillScaling.types";
import { ESCALADO_LV_DEFAULT } from "../escaladoLvDefault";


export const NINJA_SKILLS_SCALING: StructureSkillScaling = {
    Daga: {
        [UNIQUE_ID_SKILLS.EMBOSCADA]: {
            type: 'damage',
            cd: { onActivate: 1 },
            components: [{
                damageType: 'ad',
                escaladoLv: ESCALADO_LV_DEFAULT,
                escaladoMain: { min: 1, max: 2 },
                tags: ['ad', 'melee', 'skill', 'weapon'],
                escaladoAtributos: { DEX: 1, STR: 1 }
            }],
            mana: { base: 1, perLv: 1 },
            damageModifiersScaling: {
                type: 'chance_multiplier',
                chanceConfig: { baseChance: 30, perLv: 1 },
                multiplier: { baseMultiplier: 1.45, perLv: 0 }
            }
        },
        [UNIQUE_ID_SKILLS.DAGA_RODANTE]: {
            type: 'damage',
            cd: { onActivate: 1 },
            components: [{
                damageType: 'ad',
                escaladoLv: ESCALADO_LV_DEFAULT,
                escaladoMain: { min: 1, max: 2 },
                tags: ['ad', 'melee', 'skill', 'weapon', 'veneno'],
                escaladoAtributos: { DEX: 1, STR: 1 }
            }],
            mana: { base: 1, perLv: 1 },
            hitModifiersScaling: {
                type: 'weighted_hit_count',
                optionsScaling: [{
                    hitsConfig: { base: 2, perLv: 0 },
                    chancesConfig: { base: 70, per_lv: -1 },
                    damageMultiplierPerHitConfig: { base: 1, perLv: 1 }
                },
                {
                    hitsConfig: { base: 3, perLv: 0 },
                    chancesConfig: { base: 10, per_lv: 1 },
                    damageMultiplierPerHitConfig: { base: 1, perLv: 1 }
                },]
            },
            statusEffectScaling: {
                veneno: { base: 10, perLv: 0.5 }
            }
        },
        [UNIQUE_ID_SKILLS.NUBE_TOXICA]: {
            type: 'damage',
            cd: { onActivate: 1 },
            components: [{
                damageType: 'ap',
                escaladoLv: ESCALADO_LV_DEFAULT,
                escaladoMain: { min: 1, max: 2 },
                tags: ['ap', 'ranged', 'skill', 'weapon', 'veneno'],
                escaladoAtributos: { DEX: 1, INT: 1 }
            }],
            mana: { base: 1, perLv: 1 },
            statusEffectScaling: {
                veneno: { base: 50, perLv: 2 }
            },
        },
        [UNIQUE_ID_SKILLS.ATAQUE_RAPIDO]: {
            type: 'damage',
            cd: { onActivate: 1 },
            components: [{
                damageType: 'ad',
                escaladoLv: ESCALADO_LV_DEFAULT,
                escaladoMain: { min: 1, max: 2 },
                tags: ['ad', 'melee', 'skill', 'weapon'],
                escaladoAtributos: { DEX: 1, STR: 1 },
                statsScaling: [{
                    stat: 'va',
                    base: 1,
                    perLv: 1,
                    target: 'general.va'
                }]
            }],
            mana: { base: 1, perLv: 1 },

        },
        [UNIQUE_ID_SKILLS.CAMUFLAJE]: {
            type: 'buff',
            duration: {
                base: 10,
                perLv: 0.1
            },
            statsScaling: [],
            uses: {
                base: 1,
                perLv: 0
            },
            cd: { onActivate: 1 },
            mana: { base: 1, perLv: 1 },
            multiplier: {
                base: 1,
                escaladoLv: ESCALADO_LV_DEFAULT
            }
        },
    },
    Flecha: {
        [UNIQUE_ID_SKILLS.DISPARO_REPETIDO]: {
            type: 'damage',
            cd: { onActivate: 1 },
            components: [{
                damageType: 'ad',
                escaladoLv: ESCALADO_LV_DEFAULT,
                escaladoMain: { min: 1, max: 2 },
                tags: ['ad', 'ranged', 'skill', 'weapon'],
                escaladoAtributos: { DEX: 1, STR: 1 },
                statsScaling: [{
                    target: 'general.va',
                    stat: 'va',
                    base: 1,
                    perLv: 0.2
                }]
            }],
            hitModifiersScaling: {
                type: 'chance_multi_hit',
                chancesConfig: { base: 100, per_lv: 0 },
                damageMultiplierPerHitConfig: { base: 1, perLv: 0 },
                hitsConfig: { base: 3, perLv: 0.139 }
            },
            mana: { base: 1, perLv: 1 },
        },
        [UNIQUE_ID_SKILLS.FLECHA_DE_FUEGO]: {
            type: 'damage',
            cd: { onActivate: 1 },
            components: [{
                damageType: 'ad',
                escaladoLv: ESCALADO_LV_DEFAULT,
                escaladoMain: { min: 1, max: 2 },
                tags: ['ad', 'ranged', 'skill', 'weapon', 'incendio'],
                escaladoAtributos: { DEX: 1, STR: 1 },
            }],
            mana: { base: 1, perLv: 1 },
            statusEffectScaling: {
                incendio: { base: 20, perLv: 1 }
            },
        },
        [UNIQUE_ID_SKILLS.FLECHA_VENENOSA]: {
            type: 'damage',
            cd: { onActivate: 1 },
            components: [{
                damageType: 'ad',
                escaladoLv: ESCALADO_LV_DEFAULT,
                escaladoMain: { min: 1, max: 2 },
                tags: ['ad', 'ranged', 'skill', 'weapon', 'veneno'],
                escaladoAtributos: { DEX: 1, STR: 1 },
            }],
            mana: { base: 1, perLv: 1 },
            statusEffectScaling: {
                veneno: { base: 20, perLv: 1 }
            },
        },
        [UNIQUE_ID_SKILLS.LLUVIA_DE_FLECHAS]: {
            type: 'damage',
            cd: { onActivate: 1 },
            components: [{
                damageType: 'ad',
                escaladoLv: ESCALADO_LV_DEFAULT,
                escaladoMain: { min: 1, max: 2 },
                tags: ['ad', 'ranged', 'skill', 'weapon'],
                escaladoAtributos: { DEX: 1, STR: 1 },
            }],
            mana: { base: 1, perLv: 1 },
            damageModifiersScaling: {
                type: 'weighted_multiplier',
                options: [{
                    chanceConfig: { baseChance: 0, perLv: 0 },
                    multiplier: { baseMultiplier: 2, perLv: 0 },

                },
                {
                    chanceConfig: { baseChance: 0, perLv: 0 },
                    multiplier: { baseMultiplier: 3, perLv: 0 }
                },
                {
                    chanceConfig: { baseChance: 0, perLv: 0 },
                    multiplier: { baseMultiplier: 4, perLv: 0 }
                },
                {
                    chanceConfig: { baseChance: 0, perLv: 0 },
                    multiplier: { baseMultiplier: 5, perLv: 0 }
                }
                ]
            }
        },
        [UNIQUE_ID_SKILLS.CAMINO_PLUMA]: {
            type: "aura",
            escaladoAtributos: {},
            cd: {onDeactivate: 5},
            mana: {base:1,perLv:1},
            duration: {base:1,perLv:1},
            escaladoStatsModifiers: []
        },
    },

}