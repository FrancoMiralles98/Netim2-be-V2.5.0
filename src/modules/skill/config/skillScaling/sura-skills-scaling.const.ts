import { UNIQUE_ID_SKILLS } from "netim2-shared";
import { StructureSkillScaling } from "../../types/structureSkillScaling.types";
import { ESCALADO_LV_DEFAULT } from "../escaladoLvDefault";


export const SURA_SKILLS_SCALING: StructureSkillScaling = {
    MagiaNegra: {
        [UNIQUE_ID_SKILLS.GOLPE_OSCURO]: {
            type: 'damage',
            cd: { onActivate: 1 },
            components: [{
                damageType: 'ap',
                escaladoLv: ESCALADO_LV_DEFAULT,
                escaladoMain: { min: 1, max: 2 },
                tags: ['ap', 'ranged', 'skill', 'weapon'],
                escaladoAtributos: { VIT: 1, INT: 1 }
            }],
            mana: { base: 1, perLv: 1 },
        },
        [UNIQUE_ID_SKILLS.ESPIRITU_DE_LA_LLAMA]: {
            type: "damage",
            mana: {
                base: 1,
                perLv: 1
            },
            cd: { onDeactivate: 3 },
            components: [{
                damageType: 'ap',
                escaladoLv: ESCALADO_LV_DEFAULT,
                escaladoMain: { min: 1, max: 2 },
                tags: ['ap', 'skill', 'ranged', 'incendio'],
                escaladoAtributos: { VIT: 1, INT: 1 }
            }],
            statusEffectScaling: {
                incendio: { base: 10, perLv: 0.4 }
            },
        },
        [UNIQUE_ID_SKILLS.GOLPE_ESPIRITUAL]: {
            type: 'damage',
            cd: { onActivate: 1 },
            components: [{
                damageType: 'ap',
                escaladoLv: ESCALADO_LV_DEFAULT,
                escaladoMain: { min: 1, max: 2 },
                tags: ['ap', 'ranged', 'skill', 'cc'],
                escaladoAtributos: { VIT: 1, INT: 1 }
            }],
            mana: { base: 1, perLv: 1 },
            statusEffectScaling: {
                retardo: { base: 34.8, perLv: 1.89 }
            },
        },
        [UNIQUE_ID_SKILLS.GOLPE_DE_LLAMA]: {
            type: 'damage',
            cd: { onActivate: 1 },
            components: [{
                damageType: 'ap',
                escaladoLv: ESCALADO_LV_DEFAULT,
                escaladoMain: { min: 1, max: 2 },
                tags: ['ap', 'ranged', 'skill', 'incendio'],
                escaladoAtributos: { VIT: 1, INT: 1, STR: 1 }
            }],
            mana: { base: 1, perLv: 1 },
            statusEffectScaling: {
                incendio: { base: 30, perLv: 10 }
            }
        },
        [UNIQUE_ID_SKILLS.ORBE_OSCURO]: {
            type: 'damage',
            cd: { onActivate: 1 },
            components: [{
                damageType: 'ap',
                escaladoLv: ESCALADO_LV_DEFAULT,
                escaladoMain: { min: 1, max: 2 },
                tags: ['ap', 'ranged', 'skill', 'weapon'],
                escaladoAtributos: { VIT: 1, INT: 1 }
            }],
            mana: { base: 1, perLv: 1 },
        },
        [UNIQUE_ID_SKILLS.PROTECCION_OSCURA]: {
            type: "aura",
            escaladoAtributos: {},
            cd: { onDeactivate: 5 },
            mana: { base: 1, perLv: 1 },
            duration: { base: 1, perLv: 1 },
            escaladoBuffos: {
                def_hab: {
                    base: 1,
                    escaladoLv: {
                        perLv: 0.27,
                        basicMulti: 1,
                        masterMulti: 1,
                        granMasterMulti: 1,
                        perfectMulti: 1,
                    },
                    scaleWithAttribute: false
                },
            },
        },
    },
    Espejo: {
        [UNIQUE_ID_SKILLS.GOLPE_DE_DEDO]: {
            type: 'damage',
            cd: { onActivate: 1 },
            components: [{
                damageType: 'ad',
                escaladoLv: ESCALADO_LV_DEFAULT,
                escaladoMain: { min: 1, max: 2 },
                tags: ['ad', 'melee', 'skill'],
                escaladoAtributos: { VIT: 1, INT: 1 }
            }],
            mana: { base: 1, perLv: 1 },
            mechanicsEffectScaling: {
                penetracion_habilidad: { base: 1, perLv: 1 }
            }
        },
        [UNIQUE_ID_SKILLS.REMOLINO_DRAGON]: {
            type: 'damage',
            cd: { onActivate: 1 },
            components: [{
                damageType: 'ad',
                escaladoLv: ESCALADO_LV_DEFAULT,
                escaladoMain: { min: 1, max: 2 },
                tags: ['ad', 'melee', 'skill', 'weapon'],
                escaladoAtributos: { VIT: 1, INT: 1 }
            }],
            mana: { base: 1, perLv: 1 },
            statusEffectScaling: {
                retardo: { base: 1, perLv: 1 }
            }
        },
        [UNIQUE_ID_SKILLS.ANULAR_MAGIA]: {
            type: 'damage',
            cd: { onActivate: 1 },
            components: [{
                damageType: 'ap',
                escaladoLv: ESCALADO_LV_DEFAULT,
                escaladoMain: { min: 1, max: 2 },
                tags: ['ap', 'ranged', 'skill'],
                escaladoAtributos: { VIT: 1, INT: 1 }
            }],
            mana: { base: 1, perLv: 1 },
            mechanicsEffectScaling: {
                vampirismo_hechizo: { base: 2, perLv: 1 }
            }
        },
        [UNIQUE_ID_SKILLS.HOJA_ENCANTADA]: {
            type: "aura",
            cd: { onDeactivate: 5 },
            mana: { base: 1, perLv: 1 },
            duration: { base: 1, perLv: 1 },
            escaladoAtributos: { INT: 1.5, VIT: 0.5 },
            escaladoBuffos: {
                media: {
                    base: 1,
                    escaladoLv: {
                        perLv: 0.7,
                        basicMulti: 1,
                        masterMulti: 1.05,
                        granMasterMulti: 1.1,
                        perfectMulti: 1.15,
                    },
                    scaleWithAttribute: true
                },
                robo_vida: {
                    base: 1,
                    escaladoLv: {
                        perLv: 0.27,
                        basicMulti: 1,
                        masterMulti: 1,
                        granMasterMulti: 1,
                        perfectMulti: 1,
                    },
                    scaleWithAttribute: false
                },
            },
        },
        [UNIQUE_ID_SKILLS.ARMADURA_ENCANTADA]: {
            type: "aura",
            cd: { onDeactivate: 5 },
            mana: { base: 1, perLv: 1 },
            duration: { base: 1, perLv: 1 },
            escaladoAtributos: {},
            escaladoBuffos: {
                def_media: {
                    base: 1,
                    escaladoLv: {
                        perLv: 0.22,
                        basicMulti: 1,
                        masterMulti: 1,
                        granMasterMulti: 1,
                        perfectMulti: 1,
                    },
                    scaleWithAttribute: false
                },
                reflectar: {
                    base: 1,
                    escaladoLv: {
                        perLv: 0.55,
                        basicMulti: 1,
                        masterMulti: 1,
                        granMasterMulti: 1,
                        perfectMulti: 1,
                    },
                    scaleWithAttribute: false
                },
            },
        },
        [UNIQUE_ID_SKILLS.MIEDO]: {
            type: "aura",
            cd: { onDeactivate: 5 },
            mana: { base: 1, perLv: 1 },
            duration: { base: 1, perLv: 1 },
            escaladoAtributos: {},
            escaladoBuffos: {
                bloquear_ataques: {
                    base: 1,
                    escaladoLv: {
                        perLv: 0.4,
                        basicMulti: 1,
                        masterMulti: 1,
                        granMasterMulti: 1,
                        perfectMulti: 1,
                    },
                    scaleWithAttribute: false
                },
                esquivar_ataques: {
                    base: 1,
                    escaladoLv: {
                        perLv: 0.4,
                        basicMulti: 1,
                        masterMulti: 1,
                        granMasterMulti: 1,
                        perfectMulti: 1,
                    },
                    scaleWithAttribute: false
                },
            },
        },
    },
}