import { UNIQUE_ID_SKILLS } from "netim2-shared";
import { StructureSkillScaling } from "../../types/structureSkillScaling.types";
import { ESCALADO_LV_DEFAULT } from "../escaladoLvDefault";


export const CHAMAN_SKILLS_SCALING: StructureSkillScaling = {
    Luz: {
        [UNIQUE_ID_SKILLS.CURACION]: {
            type: 'heal',
            cd: { onActivate: 1 },
            components: [{
                damageType: 'true',
                tags: ['heal', 'ap', 'skill'],
                escaladoMain: {
                    min: 1,
                    max: 2
                },
                escaladoLv: ESCALADO_LV_DEFAULT,
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
            cd: { onActivate: 1 },
            components: [{
                damageType: 'ap',
                escaladoLv: ESCALADO_LV_DEFAULT,
                escaladoMain: {
                    min: 1,
                    max: 2
                },
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
            cd: { onActivate: 1 },
            components: [{
                damageType: 'ap',
                escaladoLv: ESCALADO_LV_DEFAULT,
                escaladoMain: {
                    min: 1,
                    max: 2
                },
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
            cd: { onActivate: 1 },
            components: [{
                damageType: 'ap',
                escaladoLv: ESCALADO_LV_DEFAULT,
                escaladoMain: {
                    min: 1,
                    max: 1
                },
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
            cd: { onDeactivate: 1 },
            duration: { base: 1, perLv: 1 },
            mana: { base: 1, perLv: 1 },
            escaladoAtributos: {
                STR: 1,
                INT: 1
            },
            escaladoBuffos: {
                vm: {
                    base: 1,
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
                    base: 1,
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
        },
        [UNIQUE_ID_SKILLS.REMOLINOS]: {
            type: "aura",
            cd: { onDeactivate: 1 },
            duration: { base: 1, perLv: 1 },
            mana: { base: 1, perLv: 1 },
            escaladoAtributos: {
                DEX: 1,
                INT: 1
            },
            escaladoBuffos: {
                vm: {
                    base: 1,
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
                    base: 1,
                    escaladoLv: {
                        perLv: 0.3,
                        basicMulti: 1.2,
                        masterMulti: 1.4,
                        granMasterMulti: 1.6,
                        perfectMulti: 1.8,
                    },
                    scaleWithAttribute: true
                },
            }
        },
    },
    Dragon: {
        [UNIQUE_ID_SKILLS.DISPARO_DEL_DRAGON]: {
            type: "damage",
            cd: { onActivate: 1 },
            components: [{
                damageType: 'ap',
                escaladoLv: ESCALADO_LV_DEFAULT,
                escaladoMain: { min: 1, max: 2 },
                tags: ['ap', 'incendio', 'ranged', 'skill', 'weapon'],
                escaladoAtributos: {
                    INT: 1,
                    STR: 1
                },
            }],
            mana: {
                base: 1,
                perLv: 1
            },
            statusEffectScaling: {
                incendio: { base: 15, perLv: 1 }
            },
        },
        [UNIQUE_ID_SKILLS.RUGIDO_DEL_DRAGON]: {
            type: "damage",
            cd: { onActivate: 1 },
            components: [{
                damageType: 'ap',
                escaladoLv: ESCALADO_LV_DEFAULT,
                escaladoMain: { min: 1, max: 2 },
                tags: ['ap', 'incendio', 'ranged', 'skill', 'weapon'],
                escaladoAtributos: {
                    VIT: 1,
                    INT: 1,
                    STR: 1
                },
            }],
            mana: {
                base: 1,
                perLv: 1
            },
            statusEffectScaling: {
                incendio: { base: 1, perLv: 1 }
            }

        },
        [UNIQUE_ID_SKILLS.TALISMAN_VOLADOR]: {
            type: "damage",
            cd: { onActivate: 1 },
            components: [{
                damageType: 'ap',
                escaladoLv: ESCALADO_LV_DEFAULT,
                escaladoMain: { min: 1, max: 2 },
                tags: ['ap', 'skill', 'ranged']
            }],
            mana: {
                base: 1,
                perLv: 1
            },
            damageModifiersScaling: {
                type: 'conditional_multiplier',
                multiplier: {
                    baseMultiplier: 1.30,
                    perLv: 0.01
                }
            }
        },
        [UNIQUE_ID_SKILLS.FUERZA_DEL_DRAGON]: {
            type: "aura",
            cd: { onDeactivate: 1 },
            duration: { base: 1, perLv: 1 },
            mana: { base: 1, perLv: 1 },
            escaladoAtributos: { INT: 1, STR: 1 },
            escaladoBuffos: {
                critico: {
                    base: 1,
                    escaladoLv: {
                        perLv: 0.2,
                        basicMulti: 1.1,
                        masterMulti: 1.2,
                        granMasterMulti: 1.3,
                        perfectMulti: 1.4,
                    },
                    scaleWithAttribute: true
                },
            },
        },
        [UNIQUE_ID_SKILLS.BENDICION]: {
            type: "aura",
            cd: { onDeactivate: 1 },
            duration: { base: 1, perLv: 1 },
            mana: { base: 1, perLv: 1 },
            escaladoAtributos: { INT: 0.5, VIT: 0.5 },
            escaladoBuffos: {
                def_media: {
                    base: 1,
                    escaladoLv: {
                        perLv: 0.2,
                        basicMulti: 0.9,
                        masterMulti: 1,
                        granMasterMulti: 1,
                        perfectMulti: 1,
                    },
                    scaleWithAttribute: true
                },
            },
        },
        [UNIQUE_ID_SKILLS.REFLECTAR]: {
            type: "aura",
            cd: { onDeactivate: 1 },
            duration: { base: 1, perLv: 1 },
            mana: { base: 1, perLv: 1 },
            escaladoAtributos: { INT: 1, DEX: 1 },
            escaladoBuffos: {
                reflectar: {
                    base: 1,
                    escaladoLv: {
                        perLv: 0.4,
                        basicMulti: 1,
                        masterMulti: 1.05,
                        granMasterMulti: 1.1,
                        perfectMulti: 1.2,
                    },
                    scaleWithAttribute: true
                },
            },
        },
    },
}