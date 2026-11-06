import { UNIQUE_ID_SKILLS } from "netim2-shared";
import { StructureSkillScaling } from "../../types/structureSkillScaling.types";


export const CHAMAN_SKILLS_SCALING: StructureSkillScaling = {
    Luz: {
        [UNIQUE_ID_SKILLS.CURACION]: {
            type: 'heal',
            components: {
                tags: [],
                healing: {
                    min: {
                        progression: {
                            type: 'per_level', base: 100,
                            perLevel: { N: 1, M: 2, G: 3 }, perfectBonus: 200
                        },
                        contributions: [{
                            operation: 'flat', coefficient: 1.5,
                            source: { type: 'stat', path: 'general.ap.min', }
                        }]
                    },
                    max: {
                        progression: {
                            type: 'per_level', base: 150,
                            perLevel: { N: 1, M: 2, G: 3 }, perfectBonus: 200
                        },
                        contributions: [{
                            operation: 'flat', coefficient: 1.5,
                            source: { type: 'stat', path: 'general.ap.min' }
                        }]
                    }
                }
            },
            cd: {
                onActivate: {
                    progression: { type: 'constant', value: 25 },
                },
            },
            mana: {
                type: 'instant',
                amount: {
                    progression: {
                        type: 'per_level',
                        base: 100,
                        perLevel: { N: 7, M: 17, G: 28 },
                        perfectBonus: 50
                    },
                }
            }
        },
        [UNIQUE_ID_SKILLS.LLAMADA_RELAMPAGO]: {
            type: 'damage',
            components: {
                damage: {
                    type: 'damage',
                    range: {
                        min: {
                            progression: {
                                type: 'per_level', base: 10,
                                perLevel: { N: 1, M: 2, G: 3, }, perfectBonus: 500
                            },
                            contributions: [{
                                operation: 'flat', coefficient: 1.5,
                                source: { type: 'stat', path: 'general.ap.min', }
                            }]
                        },
                        max: {
                            progression: {
                                type: 'per_level',
                                base: 20,
                                perLevel: {
                                    N: 1,
                                    M: 2,
                                    G: 3,
                                },
                                perfectBonus: 500
                            },
                            contributions: [{
                                operation: 'flat',
                                coefficient: 3,
                                source: {
                                    type: 'stat',
                                    path: 'general.ap.max',
                                }
                            }]

                        }
                    },
                },
                damageType: 'ap',
                tags: [],
            },
            cd: {
                onActivate: {
                    progression: {
                        type: 'constant',
                        value: 20
                    },
                }
            },
            mana: {
                type: 'instant',
                amount: {
                    progression: {
                        type: 'per_level',
                        base: 80,
                        perLevel: {
                            N: 2,
                            M: 4,
                            G: 5,
                        },
                        perfectBonus: 200
                    },
                },
            },
        },
        [UNIQUE_ID_SKILLS.TIRO_RELAMPAGO]: {
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
        [UNIQUE_ID_SKILLS.GARRA_RELAMPAGO]: {
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
        [UNIQUE_ID_SKILLS.ATAQUE]: {
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
        [UNIQUE_ID_SKILLS.REMOLINOS]: {
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
    Dragon: {
        [UNIQUE_ID_SKILLS.DISPARO_DEL_DRAGON]: {
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
        [UNIQUE_ID_SKILLS.RUGIDO_DEL_DRAGON]: {
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
        [UNIQUE_ID_SKILLS.TALISMAN_VOLADOR]: {
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
        [UNIQUE_ID_SKILLS.FUERZA_DEL_DRAGON]: {
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
        [UNIQUE_ID_SKILLS.BENDICION]: {
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
        [UNIQUE_ID_SKILLS.REFLECTAR]: {
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
