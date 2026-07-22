import { UNIQUE_ID_SKILLS } from "netim2-shared";
import { StructureSkillScaling } from "../../types/structureSkillScaling.types";


export const CHAMAN_SKILLS_SCALING: StructureSkillScaling = {
    Luz: {
        [UNIQUE_ID_SKILLS.CURACION]: {
            type: 'heal',
            cd: 30,
            components: [{
                damageType: 'true',
                id: '',
                tags: ['heal', 'ap', 'skill'],
                escaladoMain: {
                    min: 1,
                    max: 2
                },
                escaladoLv: {
                    perLv: 2,
                    basicMulti: 2,
                    masterMulti: 4,
                    granMasterMulti: 6,
                    perfectMulti: 8
                },
                escaladoAtributos: {
                    VIT: 20,
                    INT: 20
                },
                statsScaling: []
            }],
            mana: {
                base: 100,
                perLv: 5
            },
        },
        [UNIQUE_ID_SKILLS.LLAMADA_RELAMPAGO]: {
            type: 'damage',
            cd: 15,
            components: [{
                damageType: 'ap',
                escaladoLv: {
                    perLv: 2,
                    basicMulti: 2,
                    masterMulti: 4,
                    granMasterMulti: 6,
                    perfectMulti: 8
                },
                escaladoMain: {
                    min: 1,
                    max: 2
                },
                id: '',
                tags: ['ap', 'skill', 'electrico', 'cc', 'ranged', 'weapon'],
                escaladoAtributos: {
                    INT: 0,
                    DEX: 0
                },
            }],
            mana: {
                base: 20,
                perLv: 8
            },
            statusEffectScaling: {
                desmayo: { base: 20, perLv: 1.5 },
                electrico: { base: 19, perLv: 2 }
            },
        },
        [UNIQUE_ID_SKILLS.TIRO_RELAMPAGO]: {
            type: 'damage',
            cd: 15,
            components: [{
                damageType: 'ap',
                escaladoLv: {
                    perLv: 2,
                    basicMulti: 2,
                    masterMulti: 4,
                    granMasterMulti: 6,
                    perfectMulti: 8
                },
                escaladoMain: {
                    min: 1,
                    max: 2
                },
                id: '',
                tags: ['ap', 'electrico', 'skill', 'ranged', 'weapon'],
                escaladoAtributos: {
                    INT: 20
                },
            }],
            mana: {
                base: 1,
                perLv: 1
            },
            statusEffectScaling: {
                electrico: { base: 30, perLv: 1.5 }
            },
        },
        [UNIQUE_ID_SKILLS.GARRA_RELAMPAGO]: {
            type: 'damage',
            cd: 20,
            components: [{
                damageType: 'ap',
                escaladoLv: {
                    perLv: 2,
                    basicMulti: 2,
                    masterMulti: 4,
                    granMasterMulti: 6,
                    perfectMulti: 8
                },
                escaladoMain: {
                    min: 1,
                    max: 1
                },
                id: '',
                tags: ['ap', 'electrico', 'skill', 'ranged', 'weapon'],
                escaladoAtributos: {
                    INT: 1,
                    DEX: 1
                },
            }],
            mana: {
                base: 1,
                perLv: 1
            },
            statusEffectScaling: {
                electrico: { base: 20, perLv: 1.5 }
            },
            hitModifiersScaling: {
                type: 'chance_multi_hit',
                chancesConfig: {
                    base: 40,
                    per_lv: 1
                },
                damageMultiplierPerHitConfig: {
                    base: 0.50,
                    perLv: 0.01
                },
                hitsConfig: {
                    base: 2,
                    perLv: 0.1112
                }
            }
        },
        [UNIQUE_ID_SKILLS.ATAQUE]: {
            type: 'aura',
            escaladoAtributos: {
                STR: 1,
                INT: 1
            },
            escaladoBuffos: {
                vm: {
                    base:1,
                    escaladoLv: {
                        perLv: 0.3,
                        basicMulti: 1.2,
                        masterMulti: 1.4,
                        granMasterMulti: 1.6,
                        perfectMulti: 1.8,
                    },
                    scaleWithAttribute: true
                },
                vh: {
                    base:1,
                    escaladoLv: {
                        perLv: 0.3,
                        basicMulti: 1.2,
                        masterMulti: 1.4,
                        granMasterMulti: 1.6,
                        perfectMulti: 1.8,
                    },
                    scaleWithAttribute: true
                },
            },
            mana: {
                base: 70,
                perLv: 2
            },
            duration: {
                base: 30,
                perLv: 1
            }
        },
        [UNIQUE_ID_SKILLS.REMOLINOS]: {
            type: "aura",
            escaladoAtributos: { INT: 0.5, DEX: 1.5 },
            escaladoBuffos: {
                vm: {
                    escaladoLv: {
                        perLv: 0.3,
                        basicMulti: 1.2,
                        masterMulti: 1.4,
                        granMasterMulti: 1.6,
                        perfectMulti: 1.8,
                    },
                    scaleWithAtribute: true
                },
                vh: {
                    escaladoLv: {
                        perLv: 0.3,
                        basicMulti: 1.2,
                        masterMulti: 1.4,
                        granMasterMulti: 1.6,
                        perfectMulti: 1.8,
                    },
                    scaleWithAtribute: true
                },
            },
        },
    },
    Dragon: {
        [UNIQUE_ID_SKILLS.DISPARO_DEL_DRAGON]: {
            type: "damage",
            cd: 8,
            escaladoMain: { min: 0.70, max: 0.70 },
            escaladoLv: {
                perLv: 1.50,
                basicMulti: 2,
                masterMulti: 4,
                granMasterMulti: 6,
                perfectMulti: 8
            },
            escaladoAtributos: { INT: 4, DEX: 2 },
            escaladoEfecto: {
                penetracion_habilidad: { base: 0, perLv: 0 },
                desmayo: { base: 0, perLv: 0 },
                veneno: { base: 0, perLv: 0 },
                incendio: { base: 1, perLv: 1 },
                retardo: { base: 0, perLv: 0 },
                sangrado: { base: 0, perLv: 0 },
                vampirismo_hechizo: { base: 0, perLv: 0 }
            },

        },
        [UNIQUE_ID_SKILLS.RUGIDO_DEL_DRAGON]: {
            type: "damage",
            cd: 20,
            escaladoMain: { min: 0.80, max: 1.10 },
            escaladoLv: {
                perLv: 1.5,
                basicMulti: 2,
                masterMulti: 4,
                granMasterMulti: 6,
                perfectMulti: 8
            },
            escaladoAtributos: { INT: 4, VIT: 3, DEX: 1 },
            escaladoEfecto: {
                penetracion_habilidad: { base: 0, perLv: 0 },
                desmayo: { base: 0, perLv: 0 },
                veneno: { base: 0, perLv: 0 },
                incendio: { base: 5, perLv: 1.50 },
                retardo: { base: 0, perLv: 0 },
                sangrado: { base: 0, perLv: 0 },
                vampirismo_hechizo: { base: 0, perLv: 0 }
            },

        },
        [UNIQUE_ID_SKILLS.TALISMAN_VOLADOR]: {
            type: "damage",
            cd: 7,
            escaladoMain: { min: 0.66, max: 0.74 },
            escaladoLv: {
                perLv: 1.5,
                basicMulti: 2,
                masterMulti: 4,
                granMasterMulti: 6,
                perfectMulti: 8
            },
            escaladoAtributos: { INT: 4, DEX: 2 },
            escaladoEfecto: {
                penetracion_habilidad: { base: 0, perLv: 0 },
                desmayo: { base: 0, perLv: 0 },
                veneno: { base: 0, perLv: 0 },
                incendio: { base: 0, perLv: 0 },
                retardo: { base: 0, perLv: 0 },
                sangrado: { base: 0, perLv: 0 },
                vampirismo_hechizo: { base: 0, perLv: 0 }
            },

        },
        [UNIQUE_ID_SKILLS.FUERZA_DEL_DRAGON]: {
            type: "aura",
            escaladoAtributos: { INT: 1, STR: 1 },
            escaladoBuffos: {
                critico: {
                    escaladoLv: {
                        perLv: 0.2,
                        basicMulti: 1.1,
                        masterMulti: 1.2,
                        granMasterMulti: 1.3,
                        perfectMulti: 1.4,
                    },
                    scaleWithAtribute: true
                },
            },
        },
        [UNIQUE_ID_SKILLS.BENDICION]: {
            type: "aura",
            escaladoAtributos: { INT: 0.5, VIT: 0.5 },
            escaladoBuffos: {
                def_media: {
                    escaladoLv: {
                        perLv: 0.2,
                        basicMulti: 0.9,
                        masterMulti: 1,
                        granMasterMulti: 1,
                        perfectMulti: 1,
                    },
                    scaleWithAtribute: true
                },
            },
        },
        [UNIQUE_ID_SKILLS.REFLECTAR]: {
            type: "aura",
            escaladoAtributos: { INT: 1, DEX: 1 },
            escaladoBuffos: {
                reflectar: {
                    escaladoLv: {
                        perLv: 0.4,
                        basicMulti: 1,
                        masterMulti: 1.05,
                        granMasterMulti: 1.1,
                        perfectMulti: 1.2,
                    },
                    scaleWithAtribute: true
                },
            },
        },
    },
}