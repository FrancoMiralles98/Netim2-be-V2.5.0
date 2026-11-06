import { UNIQUE_ID_SKILLS } from "netim2-shared";
import { StructureSkillScaling } from "../../types/structureSkillScaling.types";



export const NINJA_SKILLS_SCALING: StructureSkillScaling = {
    Daga: {
        [UNIQUE_ID_SKILLS.EMBOSCADA]: {
            type: 'damage',
            components: {
                damage: {
                    type: 'damage',
                    range: {
                        min: {
                            progression: {
                                type: 'per_level', base: 10,
                                perLevel: { N: 1, M: 2, G: 3 }, perfectBonus: 500,
                            },
                            contributions: [{
                                operation: 'flat', coefficient: 1.5,
                                source: { type: 'stat', path: 'general.ap.min' },
                            }],
                        },
                        max: {
                            progression: {
                                type: 'per_level', base: 20,
                                perLevel: { N: 1, M: 2, G: 3 }, perfectBonus: 500,
                            },
                            contributions: [{
                                operation: 'flat', coefficient: 3,
                                source: { type: 'stat', path: 'general.ap.max' },
                            }],
                        },
                    },
                },
                damageType: 'ap',
                tags: [],
            },
            cd: { onActivate: { progression: { type: 'constant', value: 20 } } },
            mana: {
                type: 'instant',
                amount: {
                    progression: {
                        type: 'per_level', base: 80,
                        perLevel: { N: 2, M: 4, G: 5 }, perfectBonus: 200,
                    },
                },
            },
        },
        [UNIQUE_ID_SKILLS.DAGA_RODANTE]: {
            type: 'damage',
            components: {
                damage: {
                    type: 'damage',
                    range: {
                        min: {
                            progression: {
                                type: 'per_level', base: 10,
                                perLevel: { N: 1, M: 2, G: 3 }, perfectBonus: 500,
                            },
                            contributions: [{
                                operation: 'flat', coefficient: 1.5,
                                source: { type: 'stat', path: 'general.ap.min' },
                            }],
                        },
                        max: {
                            progression: {
                                type: 'per_level', base: 20,
                                perLevel: { N: 1, M: 2, G: 3 }, perfectBonus: 500,
                            },
                            contributions: [{
                                operation: 'flat', coefficient: 3,
                                source: { type: 'stat', path: 'general.ap.max' },
                            }],
                        },
                    },
                },
                damageType: 'ap',
                tags: [],
            },
            cd: { onActivate: { progression: { type: 'constant', value: 20 } } },
            mana: {
                type: 'instant',
                amount: {
                    progression: {
                        type: 'per_level', base: 80,
                        perLevel: { N: 2, M: 4, G: 5 }, perfectBonus: 200,
                    },
                },
            },
        },
        [UNIQUE_ID_SKILLS.NUBE_TOXICA]: {
            type: 'damage',
            components: {
                damage: {
                    type: 'damage',
                    range: {
                        min: {
                            progression: {
                                type: 'per_level', base: 10,
                                perLevel: { N: 1, M: 2, G: 3 }, perfectBonus: 500,
                            },
                            contributions: [{
                                operation: 'flat', coefficient: 1.5,
                                source: { type: 'stat', path: 'general.ap.min' },
                            }],
                        },
                        max: {
                            progression: {
                                type: 'per_level', base: 20,
                                perLevel: { N: 1, M: 2, G: 3 }, perfectBonus: 500,
                            },
                            contributions: [{
                                operation: 'flat', coefficient: 3,
                                source: { type: 'stat', path: 'general.ap.max' },
                            }],
                        },
                    },
                },
                damageType: 'ap',
                tags: [],
            },
            cd: { onActivate: { progression: { type: 'constant', value: 20 } } },
            mana: {
                type: 'instant',
                amount: {
                    progression: {
                        type: 'per_level', base: 80,
                        perLevel: { N: 2, M: 4, G: 5 }, perfectBonus: 200,
                    },
                },
            },
        },
        [UNIQUE_ID_SKILLS.ATAQUE_RAPIDO]: {
            type: 'damage',
            components: {
                damage: {
                    type: 'damage',
                    range: {
                        min: {
                            progression: {
                                type: 'per_level', base: 10,
                                perLevel: { N: 1, M: 2, G: 3 }, perfectBonus: 500,
                            },
                            contributions: [{
                                operation: 'flat', coefficient: 1.5,
                                source: { type: 'stat', path: 'general.ap.min' },
                            }],
                        },
                        max: {
                            progression: {
                                type: 'per_level', base: 20,
                                perLevel: { N: 1, M: 2, G: 3 }, perfectBonus: 500,
                            },
                            contributions: [{
                                operation: 'flat', coefficient: 3,
                                source: { type: 'stat', path: 'general.ap.max' },
                            }],
                        },
                    },
                },
                damageType: 'ap',
                tags: [],
            },
            cd: { onActivate: { progression: { type: 'constant', value: 20 } } },
            mana: {
                type: 'instant',
                amount: {
                    progression: {
                        type: 'per_level', base: 80,
                        perLevel: { N: 2, M: 4, G: 5 }, perfectBonus: 200,
                    },
                },
            },
        },
        [UNIQUE_ID_SKILLS.CAMUFLAJE]: {
            type: 'buff',
            cd: { onActivate: { progression: { type: 'constant', value: 20 } } },
            duration: {
                type: 'turns',
                turns: {
                    progression: {
                        type: 'per_level', base: 10,
                        perLevel: { N: 1, M: 2, G: 3 }, perfectBonus: 15,
                    },
                },
            },
            mana: {
                type: 'instant',
                amount: {
                    progression: {
                        type: 'per_level', base: 10,
                        perLevel: { N: 1, M: 2, G: 3 }, perfectBonus: 100,
                    },
                },
            },
            tags: [],
            statsModifiers: [],
            effects: [{
                type: 'next_skill_damage_multiplier',
                allowedSkillIds: [UNIQUE_ID_SKILLS.EMBOSCADA, UNIQUE_ID_SKILLS.ATAQUE_RAPIDO],
                consumeOn: 'skill_use',
                multiplier: {
                    progression: {
                        type: 'per_level', base: 1.1,
                        perLevel: { N: 0.01, M: 0.02, G: 0.03 }, perfectBonus: 0.5,
                    },
                },
                uses: {
                    progression: {
                        type: 'thresholds', base: 1,
                        thresholds: [
                            { at: { rank: 'M', level: 1 }, add: 1 },
                            { at: { rank: 'G', level: 1 }, add: 1 },
                        ],
                    },
                    min: 1,
                    precision: 0,
                },
            }],
        },
    },
    Flecha: {
        [UNIQUE_ID_SKILLS.DISPARO_REPETIDO]: {
            type: 'damage',
            components: {
                damage: {
                    type: 'damage',
                    range: {
                        min: {
                            progression: {
                                type: 'per_level', base: 10,
                                perLevel: { N: 1, M: 2, G: 3 }, perfectBonus: 500,
                            },
                            contributions: [{
                                operation: 'flat', coefficient: 1.5,
                                source: { type: 'stat', path: 'general.ap.min' },
                            }],
                        },
                        max: {
                            progression: {
                                type: 'per_level', base: 20,
                                perLevel: { N: 1, M: 2, G: 3 }, perfectBonus: 500,
                            },
                            contributions: [{
                                operation: 'flat', coefficient: 3,
                                source: { type: 'stat', path: 'general.ap.max' },
                            }],
                        },
                    },
                },
                damageType: 'ap',
                tags: [],
            },
            cd: { onActivate: { progression: { type: 'constant', value: 20 } } },
            mana: {
                type: 'instant',
                amount: {
                    progression: {
                        type: 'per_level', base: 80,
                        perLevel: { N: 2, M: 4, G: 5 }, perfectBonus: 200,
                    },
                },
            },
        },
        [UNIQUE_ID_SKILLS.FLECHA_DE_FUEGO]: {
            type: 'damage',
            components: {
                damage: {
                    type: 'damage',
                    range: {
                        min: {
                            progression: {
                                type: 'per_level', base: 10,
                                perLevel: { N: 1, M: 2, G: 3 }, perfectBonus: 500,
                            },
                            contributions: [{
                                operation: 'flat', coefficient: 1.5,
                                source: { type: 'stat', path: 'general.ap.min' },
                            }],
                        },
                        max: {
                            progression: {
                                type: 'per_level', base: 20,
                                perLevel: { N: 1, M: 2, G: 3 }, perfectBonus: 500,
                            },
                            contributions: [{
                                operation: 'flat', coefficient: 3,
                                source: { type: 'stat', path: 'general.ap.max' },
                            }],
                        },
                    },
                },
                damageType: 'ap',
                tags: [],
            },
            cd: { onActivate: { progression: { type: 'constant', value: 20 } } },
            mana: {
                type: 'instant',
                amount: {
                    progression: {
                        type: 'per_level', base: 80,
                        perLevel: { N: 2, M: 4, G: 5 }, perfectBonus: 200,
                    },
                },
            },
        },
        [UNIQUE_ID_SKILLS.FLECHA_VENENOSA]: {
            type: 'damage',
            components: {
                damage: {
                    type: 'damage',
                    range: {
                        min: {
                            progression: {
                                type: 'per_level', base: 10,
                                perLevel: { N: 1, M: 2, G: 3 }, perfectBonus: 500,
                            },
                            contributions: [{
                                operation: 'flat', coefficient: 1.5,
                                source: { type: 'stat', path: 'general.ap.min' },
                            }],
                        },
                        max: {
                            progression: {
                                type: 'per_level', base: 20,
                                perLevel: { N: 1, M: 2, G: 3 }, perfectBonus: 500,
                            },
                            contributions: [{
                                operation: 'flat', coefficient: 3,
                                source: { type: 'stat', path: 'general.ap.max' },
                            }],
                        },
                    },
                },
                damageType: 'ap',
                tags: [],
            },
            cd: { onActivate: { progression: { type: 'constant', value: 20 } } },
            mana: {
                type: 'instant',
                amount: {
                    progression: {
                        type: 'per_level', base: 80,
                        perLevel: { N: 2, M: 4, G: 5 }, perfectBonus: 200,
                    },
                },
            },
        },
        [UNIQUE_ID_SKILLS.LLUVIA_DE_FLECHAS]: {
            type: 'damage',
            components: {
                damage: {
                    type: 'damage',
                    range: {
                        min: {
                            progression: {
                                type: 'per_level', base: 10,
                                perLevel: { N: 1, M: 2, G: 3 }, perfectBonus: 500,
                            },
                            contributions: [{
                                operation: 'flat', coefficient: 1.5,
                                source: { type: 'stat', path: 'general.ap.min' },
                            }],
                        },
                        max: {
                            progression: {
                                type: 'per_level', base: 20,
                                perLevel: { N: 1, M: 2, G: 3 }, perfectBonus: 500,
                            },
                            contributions: [{
                                operation: 'flat', coefficient: 3,
                                source: { type: 'stat', path: 'general.ap.max' },
                            }],
                        },
                    },
                },
                damageType: 'ap',
                tags: [],
            },
            cd: { onActivate: { progression: { type: 'constant', value: 20 } } },
            mana: {
                type: 'instant',
                amount: {
                    progression: {
                        type: 'per_level', base: 80,
                        perLevel: { N: 2, M: 4, G: 5 }, perfectBonus: 200,
                    },
                },
            },
        },
        [UNIQUE_ID_SKILLS.CAMINO_PLUMA]: {
            type: 'aura',
            cd: { onActivate: { progression: { type: 'constant', value: 20 } } },
            duration: {
                type: 'turns',
                turns: {
                    progression: {
                        type: 'per_level', base: 10,
                        perLevel: { N: 1, M: 2, G: 3 }, perfectBonus: 15,
                    },
                },
            },
            mana: {
                type: 'instant',
                amount: {
                    progression: {
                        type: 'per_level', base: 10,
                        perLevel: { N: 1, M: 2, G: 3 }, perfectBonus: 100,
                    },
                },
            },
            tags: [],
            statsModifiers: [],
        },
    },

}