import { UNIQUE_ID_SKILLS } from "netim2-shared";
import { StructureSkillScaling } from "../../types/structureSkillScaling.types";


export const GUERRERO_SKILLS_SCALING: StructureSkillScaling = {
    Corporal: {
        [UNIQUE_ID_SKILLS.CORTE_DE_TRES_MANERAS]: {
            type: 'damage',
            components: {
                damage: {
                    type: 'damage',
                    range: {
                        min: {
                            progression: {
                                type: 'per_level', base: 10,
                                perLevel: { N: 10, M: 20, G: 30 }, perfectBonus: 500,
                            },
                            contributions: [
                                {
                                    operation: 'flat', coefficient: 1.2,
                                    source: { type: 'stat', path: 'general.ad.min' },
                                },
                                {
                                    operation: 'increased', coefficient: 0.2,
                                    source: { type: 'attribute', attribute: 'DEX' },
                                },
                                {
                                    operation: 'increased', coefficient: 0.1,
                                    source: { type: 'attribute', attribute: 'STR' },
                                }
                            ],
                        },
                        max: {
                            progression: {
                                type: 'per_level', base: 15,
                                perLevel: { N: 10, M: 20, G: 30 }, perfectBonus: 500,
                            },
                            contributions: [{
                                operation: 'flat', coefficient: 1.5,
                                source: { type: 'stat', path: 'general.ad.max' },
                            },
                            {
                                operation: 'increased', coefficient: 0.2,
                                source: { type: 'attribute', attribute: 'DEX' },
                            },
                            {
                                operation: 'increased', coefficient: 0.1,
                                source: { type: 'attribute', attribute: 'STR' },
                            }
                            ],
                        },
                    },
                },
                damageType: 'ad',
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
            hitModifiers: {
                type: 'chance_multi_hit',
                chance: {
                    progression: {
                        type: 'constant',
                        value: 100
                    },
                },
                damageMultiplierPerHit: {
                    progression: {
                        type: 'constant',
                        value: 1
                    }
                },
                hits: {
                    progression: {
                        type: 'constant',
                        value: 3
                    }
                },
            },
            statusEffects: [{
                effectId: 'veneno',
                chance: {
                    progression: {
                        type: 'per_level',
                        base: 10,
                        perLevel: {
                            N: 1,
                            M: 2,
                            G: 3
                        },
                        perfectBonus: 10
                    }
                },
            }]
        },
        [UNIQUE_ID_SKILLS.ROCIADA]: {
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

                            contributions: [
                                {
                                    operation: 'flat', coefficient: 1.5,
                                    source: { type: 'stat', path: 'general.ap.min' },
                                },
                                {
                                    operation: 'increased', coefficient: 0.15,
                                    source: { type: 'stat', path: 'general.vm' },
                                }
                            ],
                        },
                        max: {
                            progression: {
                                type: 'per_level', base: 20,
                                perLevel: { N: 1, M: 2, G: 3 }, perfectBonus: 500,
                            },
                            contributions: [
                                {
                                    operation: 'flat', coefficient: 3,
                                    source: { type: 'stat', path: 'general.ap.max' },
                                },
                                {
                                    operation: 'increased', coefficient: 0.15,
                                    source: { type: 'stat', path: 'general.vm' },
                                }
                            ],
                        },
                    },
                },
                damageType: 'ad',
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
            statusEffects: [
                {
                    effectId: 'desmayo',
                    chance: {
                        progression: {
                            base: 40,
                            perLevel: {
                                N: 1,
                                M: 2,
                                G: 3
                            },
                            type: 'per_level'
                        }
                    }
                }
            ]
        },
        [UNIQUE_ID_SKILLS.GIRO_DE_ESPADA]: {
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
        [UNIQUE_ID_SKILLS.AURA_DE_ESPADA]: {
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
            statsModifiers: [{
                operation: 'increased',
                target: 'bonus.daño.media',
                value: {
                    progression: {
                        type: 'per_level',
                        base: 10,
                        perLevel: {
                            N: 1,
                            M: 1.5,
                            G: 2
                        },
                        perfectBonus: 10
                    },
                    contributions: [{
                        coefficient: 0.4,
                        operation: 'increased',
                        source: { attribute: 'STR', type: 'attribute' }
                    }]
                }
            }],
        },
        [UNIQUE_ID_SKILLS.BERSEK]: {
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
            statsModifiers: [
                {
                    operation: 'flat',
                    target: 'general.va',
                    value: {
                        progression: {
                            type: 'per_level',
                            base: 1,
                            perLevel: {
                                N: 0.5,
                                M: 1,
                                G: 1.5
                            },
                            perfectBonus: 5
                        },
                        contributions: []
                    }
                },
                {
                    operation: 'flat',
                    target: 'general.vm',
                    value: {
                        progression: {
                            type: 'per_level',
                            base: 1,
                            perLevel: {
                                N: 0.5,
                                M: 1,
                                G: 1.5
                            },
                            perfectBonus: 5
                        },
                        contributions: []
                    }
                }
            ]
        },
    },
    Mental: {
        [UNIQUE_ID_SKILLS.PULSO_ESPIRITUAL]: {
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
        [UNIQUE_ID_SKILLS.GOLPE]: {
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
        [UNIQUE_ID_SKILLS.TOCON]: {
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
        [UNIQUE_ID_SKILLS.GOLPE_DE_ESPADA]: {
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
        [UNIQUE_ID_SKILLS.CUERPO_FUERTE]: {
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