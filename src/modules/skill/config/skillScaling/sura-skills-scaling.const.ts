import { UNIQUE_ID_SKILLS } from "netim2-shared";
import { StructureSkillScaling } from "../../types/structureSkillScaling.types";



export const SURA_SKILLS_SCALING: StructureSkillScaling = {
    MagiaNegra: {
        [UNIQUE_ID_SKILLS.GOLPE_OSCURO]: {
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
        [UNIQUE_ID_SKILLS.ESPIRITU_DE_LA_LLAMA]: {
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
        [UNIQUE_ID_SKILLS.GOLPE_ESPIRITUAL]: {
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
        [UNIQUE_ID_SKILLS.GOLPE_DE_LLAMA]: {
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
        [UNIQUE_ID_SKILLS.ORBE_OSCURO]: {
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
        [UNIQUE_ID_SKILLS.PROTECCION_OSCURA]: {
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
    Espejo: {
        [UNIQUE_ID_SKILLS.GOLPE_DE_DEDO]: {
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
        [UNIQUE_ID_SKILLS.REMOLINO_DRAGON]: {
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
        [UNIQUE_ID_SKILLS.ANULAR_MAGIA]: {
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
        [UNIQUE_ID_SKILLS.HOJA_ENCANTADA]: {
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
        [UNIQUE_ID_SKILLS.ARMADURA_ENCANTADA]: {
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
        [UNIQUE_ID_SKILLS.MIEDO]: {
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