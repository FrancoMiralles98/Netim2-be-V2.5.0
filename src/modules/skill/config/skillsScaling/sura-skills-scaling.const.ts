import { StructureCharacterSkillScaling } from "../../types/skill-scaling.type";

export const SURA_SKILLS_SCALING: StructureCharacterSkillScaling = {
    MagiaNegra: {
        1: {
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
            escaladoBonusDamage: false
        },
        2: {
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
            escaladoBonusDamage: false
        },
        3: {
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
            escaladoBonusDamage: false
        },
        4: {
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
            escaladoBonusDamage: false
        },
        5: {
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
            escaladoBonusDamage: false
        },
        6: {
            escaladoAtributos: {},
            escaladoBuffos: {
                def_hab: {
                    perLv: 0.27,
                    basicMulti: 1,
                    masterMulti: 1,
                    granMasterMulti: 1,
                    perfectMulti: 1,
                    scaleWithAtribute: false
                },
            },
        },
    },
    Espejo: {
        7: {
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
            escaladoBonusDamage: false
        },
        8: {
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
            escaladoBonusDamage: false
        },
        9: {
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
            escaladoBonusDamage: false
        },
        10: {
            escaladoAtributos: { INT: 1.5, VIT: 0.5 },
            escaladoBuffos: {
                media: {
                    perLv: 0.7,
                    basicMulti: 1,
                    masterMulti: 1.05,
                    granMasterMulti: 1.1,
                    perfectMulti: 1.15,
                    scaleWithAtribute: true
                },
                daño_absorbido_hp: {
                    perLv: 0.27,
                    basicMulti: 1,
                    masterMulti: 1,
                    granMasterMulti: 1,
                    perfectMulti: 1,
                    scaleWithAtribute: false
                },
            },
        },
        11: {
            escaladoAtributos: {},
            escaladoBuffos: {
                def_media: {
                    perLv: 0.22,
                    basicMulti: 1,
                    masterMulti: 1,
                    granMasterMulti: 1,
                    perfectMulti: 1,
                    scaleWithAtribute: false
                },
                reflectar: {
                    perLv: 0.55,
                    basicMulti: 1,
                    masterMulti: 1,
                    granMasterMulti: 1,
                    perfectMulti: 1,
                    scaleWithAtribute: false
                },
            },
        },
        12: {
            escaladoAtributos: {},
            escaladoBuffos: {
                bloquear_ataques: {
                    perLv: 0.4,
                    basicMulti: 1,
                    masterMulti: 1,
                    granMasterMulti: 1,
                    perfectMulti: 1,
                    scaleWithAtribute: false
                },
                esquivar_ataques: {
                    perLv: 0.4,
                    basicMulti: 1,
                    masterMulti: 1,
                    granMasterMulti: 1,
                    perfectMulti: 1,
                    scaleWithAtribute: false
                },
            },
        },
    },
}