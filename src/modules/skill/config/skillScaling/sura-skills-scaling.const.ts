import { StructureCharacterSkillScaling } from "../../types/config/skill-scaling.type";
import { UNIQUE_ID_SKILLS } from "../../types/props/unique-id-skill.enum";

export const SURA_SKILLS_SCALING: StructureCharacterSkillScaling = {
    MagiaNegra: {
        [UNIQUE_ID_SKILLS.GOLPE_OSCURO]: {
            type: "damage",
            cd: 7,
            escaladoMain: { min: 0.60, max: 0.70 },
            escaladoLv: {
                perLv: 1.5,
                basicMulti: 2,
                masterMulti: 4,
                granMasterMulti: 6,
                perfectMulti: 8
            },
            escaladoAtributos: { INT: 3, DEX: 1 },
            escaladoEfecto: {
                penetracion_habilidad: { base: 0, perLv: 0 },
                desmayo: { base: 0, perLv: 0 },
                veneno: { base: 0, perLv: 0 },
                incendio: { base: 0, perLv: 0 },
                retardo: { base: 0, perLv: 0 },
                sangrado: { base: 0, perLv: 0 }
            },
        },
        [UNIQUE_ID_SKILLS.ESPIRITU_DE_LA_LLAMA]: {
            type: "damage",
            cd: 3,
            escaladoMain: { min: 0.20, max: 0.20 },
            escaladoLv: {
                perLv: 1.5,
                basicMulti: 2,
                masterMulti: 4,
                granMasterMulti: 6,
                perfectMulti: 8
            },
            escaladoAtributos: { DEX: 1, INT: 3 },
            escaladoEfecto: {
                penetracion_habilidad: { base: 0, perLv: 0 },
                desmayo: { base: 0, perLv: 0 },
                veneno: { base: 0, perLv: 0 },
                incendio: { base: 1, perLv: 0.4 },
                retardo: { base: 0, perLv: 0 },
                sangrado: { base: 0, perLv: 0 }
            },
        },
        [UNIQUE_ID_SKILLS.GOLPE_ESPIRITUAL]: {
            type: "damage",
            cd: 12,
            escaladoMain: { min: 0.74, max: 0.74 },
            escaladoLv: {
                perLv: 1.5,
                basicMulti: 2,
                masterMulti: 4,
                granMasterMulti: 6,
                perfectMulti: 8
            },
            escaladoAtributos: { INT: 2, DEX: 1 },
            escaladoEfecto: {
                penetracion_habilidad: { base: 0, perLv: 0 },
                desmayo: { base: 0, perLv: 0 },
                veneno: { base: 0, perLv: 0 },
                incendio: { base: 0, perLv: 0 },
                retardo: { base: 34.8, perLv: 1.89 },
                sangrado: { base: 0, perLv: 0 }
            },
        },
        [UNIQUE_ID_SKILLS.GOLPE_DE_LLAMA]: {
            type: "damage",
            cd: 12,
            escaladoMain: { min: 0.80, max: 0.80 },
            escaladoLv: {
                perLv: 1.5,
                basicMulti: 2,
                masterMulti: 4,
                granMasterMulti: 6,
                perfectMulti: 8
            },
            escaladoAtributos: { INT: 2, DEX: 2, STR: 1, VIT: 1 },
            escaladoEfecto: {
                penetracion_habilidad: { base: 0, perLv: 0 },
                desmayo: { base: 0, perLv: 0 },
                veneno: { base: 0, perLv: 0 },
                incendio: { base: 5, perLv: 0.5 },
                retardo: { base: 0, perLv: 0 },
                sangrado: { base: 0, perLv: 0 }
            },
        },
        [UNIQUE_ID_SKILLS.ORBE_OSCURO]: {
            type: "damage",
            cd: 24,
            escaladoMain: { min: 1.0, max: 1.0 },
            escaladoLv: {
                perLv: 1.5,
                basicMulti: 2,
                masterMulti: 4,
                granMasterMulti: 6,
                perfectMulti: 8
            },
            escaladoAtributos: { INT: 4, VIT: 4, DEX: 1 },
            escaladoEfecto: {
                penetracion_habilidad: { base: 0, perLv: 0 },
                desmayo: { base: 0, perLv: 0 },
                veneno: { base: 0, perLv: 0 },
                incendio: { base: 0, perLv: 0 },
                retardo: { base: 0, perLv: 0 },
                sangrado: { base: 0, perLv: 0 }
            },
        },
        [UNIQUE_ID_SKILLS.PROTECCION_OSCURA]: {
            type: "aura",
            escaladoAtributos: {},
            escaladoBuffos: {
                def_hab: {
                    escaladoLv: {
                        perLv: 0.27,
                        basicMulti: 1,
                        masterMulti: 1,
                        granMasterMulti: 1,
                        perfectMulti: 1,
                    },
                    scaleWithAtribute: false
                },
            },
        },
    },
    Espejo: {
        [UNIQUE_ID_SKILLS.GOLPE_DE_DEDO]: {
            type: "damage",
            cd: 10,
            escaladoMain: { min: 0.7, max: 0.75 },
            escaladoLv: {
                perLv: 1.5,
                basicMulti: 2,
                masterMulti: 4,
                granMasterMulti: 6,
                perfectMulti: 8
            },
            escaladoAtributos: { INT: 3, STR: 3 },
            escaladoEfecto: {
                penetracion_habilidad: { base: 0, perLv: 0 },
                desmayo: { base: 0, perLv: 0 },
                veneno: { base: 0, perLv: 0 },
                incendio: { base: 0, perLv: 0 },
                retardo: { base: 0, perLv: 0 },
                sangrado: { base: 0, perLv: 0 }
            },
        },
        [UNIQUE_ID_SKILLS.REMOLINO_DRAGON]: {
            type: "damage",
            cd: 15,
            escaladoMain: { min: 1, max: 1.12 },
            escaladoLv: {
                perLv: 1.75,
                basicMulti: 2,
                masterMulti: 4,
                granMasterMulti: 6,
                perfectMulti: 8
            },
            escaladoAtributos: { INT: 3, STR: 3, DEX: 3 },
            escaladoEfecto: {
                penetracion_habilidad: { base: 0, perLv: 0 },
                desmayo: { base: 0, perLv: 0 },
                veneno: { base: 0, perLv: 0 },
                incendio: { base: 0, perLv: 0 },
                retardo: { base: 0, perLv: 0 },
                sangrado: { base: 0, perLv: 0 }
            },
        },
        [UNIQUE_ID_SKILLS.ANULAR_MAGIA]: {
            type: "damage",
            cd: 12,
            escaladoMain: { min: 0.75, max: 0.75 },
            escaladoLv: {
                perLv: 1.5,
                basicMulti: 2,
                masterMulti: 4,
                granMasterMulti: 6,
                perfectMulti: 8
            },
            escaladoAtributos: { INT: 5, DEX: 2 },
            escaladoEfecto: {
                penetracion_habilidad: { base: 0, perLv: 0 },
                desmayo: { base: 0, perLv: 0 },
                veneno: { base: 0, perLv: 0 },
                incendio: { base: 0, perLv: 0 },
                retardo: { base: 0, perLv: 0 },
                sangrado: { base: 0, perLv: 0 }
            },
        },
        [UNIQUE_ID_SKILLS.HOJA_ENCANTADA]: {
            type: "aura",
            escaladoAtributos: { INT: 1.5, VIT: 0.5 },
            escaladoBuffos: {
                media: {
                    escaladoLv: {
                        perLv: 0.7,
                        basicMulti: 1,
                        masterMulti: 1.05,
                        granMasterMulti: 1.1,
                        perfectMulti: 1.15,
                    },
                    scaleWithAtribute: true
                },
                daño_absorbido_hp: {
                    escaladoLv: {
                        perLv: 0.27,
                        basicMulti: 1,
                        masterMulti: 1,
                        granMasterMulti: 1,
                        perfectMulti: 1,
                    },
                    scaleWithAtribute: false
                },
            },
        },
        [UNIQUE_ID_SKILLS.ARMADURA_ENCANTADA]: {
            type: "aura",
            escaladoAtributos: {},
            escaladoBuffos: {
                def_media: {
                    escaladoLv: {
                        perLv: 0.22,
                        basicMulti: 1,
                        masterMulti: 1,
                        granMasterMulti: 1,
                        perfectMulti: 1,
                    },
                    scaleWithAtribute: false
                },
                reflectar: {
                    escaladoLv: {
                        perLv: 0.55,
                        basicMulti: 1,
                        masterMulti: 1,
                        granMasterMulti: 1,
                        perfectMulti: 1,
                    },
                    scaleWithAtribute: false
                },
            },
        },
        [UNIQUE_ID_SKILLS.MIEDO]: {
            type: "aura",
            escaladoAtributos: {},
            escaladoBuffos: {
                bloquear_ataques: {
                    escaladoLv: {
                        perLv: 0.4,
                        basicMulti: 1,
                        masterMulti: 1,
                        granMasterMulti: 1,
                        perfectMulti: 1,
                    },
                    scaleWithAtribute: false
                },
                esquivar_ataques: {
                    escaladoLv: {
                        perLv: 0.4,
                        basicMulti: 1,
                        masterMulti: 1,
                        granMasterMulti: 1,
                        perfectMulti: 1,
                    },
                    scaleWithAtribute: false
                },
            },
        },
    },
}