import { StructureCharacterSkillScaling } from "../../types/skill-scaling.type";

export const CHAMAN_SKILLS_SCALING: StructureCharacterSkillScaling = {
    Luz: {
        36: {
            escaladoMain: { min: 0.66, max: 0.80 },
            escaladoLv: {
                perLv: 2,
                basicMulti: 2,
                masterMulti: 4,
                granMasterMulti: 6,
                perfectMulti: 8
            },
            escaladoAtributos: { INT: 4, VIT: 4 },
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
        33: {
            escaladoMain: { min: 0.65, max: 1.1 },
            escaladoLv: {
                perLv: 1.5,
                basicMulti: 2,
                masterMulti: 4,
                granMasterMulti: 6,
                perfectMulti: 8
            },
            escaladoAtributos: { INT: 5, DEX: 1 },
            escaladoEfecto: {
                penetracion_habilidad: { base: 0, perLv: 0 },
                desmayo: { base: 20, perLv: 1.50 },
                veneno: { base: 0, perLv: 0 },
                incendio: { base: 0, perLv: 0 },
                retardo: { base: 0, perLv: 0 },
                sangrado: { base: 0, perLv: 0 }
            },
            escaladoBonusDamage: false
        },
        34: {
            escaladoMain: { min: 0.62, max: 0.70 },
            escaladoLv: {
                perLv: 1.50,
                basicMulti: 2,
                masterMulti: 4,
                granMasterMulti: 6,
                perfectMulti: 8
            },
            escaladoAtributos: { INT: 4, DEX: 4 },
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
        35: {
            escaladoMain: { min: 0.73, max: 0.82 },
            escaladoLv: {
                perLv: 1.50,
                basicMulti: 2,
                masterMulti: 4,
                granMasterMulti: 6,
                perfectMulti: 8
            },
            escaladoAtributos: { INT: 4, STR: 4 },
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
        38: {
            escaladoAtributos: { INT: 0.5, STR: 2.5 },
            escaladoBuffos: {
                ad: {
                    perLv: 1,
                    basicMulti: 1,
                    masterMulti: 2,
                    granMasterMulti: 3,
                    perfectMulti: 4,
                    scaleWithAtribute: true
                },
            },
        },
        37: {
            escaladoAtributos: { INT: 0.5, DEX: 1.5 },
            escaladoBuffos: {
                vm: {
                    perLv: 0.3,
                    basicMulti: 1.2,
                    masterMulti: 1.4,
                    granMasterMulti: 1.6,
                    perfectMulti: 1.8,
                    scaleWithAtribute: true
                },
                vh: {
                    perLv: 0.3,
                    basicMulti: 1.2,
                    masterMulti: 1.4,
                    granMasterMulti: 1.6,
                    perfectMulti: 1.8,
                    scaleWithAtribute: true
                },
            },
        },
    },
    Dragon: {
        39: {
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
                sangrado: { base: 0, perLv: 0 }
            },
            escaladoBonusDamage: false
        },
        41: {
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
                sangrado: { base: 0, perLv: 0 }
            },
            escaladoBonusDamage: false
        },
        40: {
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
                sangrado: { base: 0, perLv: 0 }
            },
            escaladoBonusDamage: false
        },
        42: {
            escaladoAtributos: { INT: 1, STR: 1 },
            escaladoBuffos: {
                critico: {
                    perLv: 0.2,
                    basicMulti: 1.1,
                    masterMulti: 1.2,
                    granMasterMulti: 1.3,
                    perfectMulti: 1.4,
                    scaleWithAtribute: true
                },
            },
        },
        43: {
            escaladoAtributos: { INT: 0.5, VIT: 0.5 },
            escaladoBuffos: {
                def_media: {
                    perLv: 0.2,
                    basicMulti: 0.9,
                    masterMulti: 1,
                    granMasterMulti: 1,
                    perfectMulti: 1,
                    scaleWithAtribute: true
                },
            },
        },
        44: {
            escaladoAtributos: { INT: 1, DEX: 1 },
            escaladoBuffos: {
                reflectar: {
                    perLv: 0.4,
                    basicMulti: 1,
                    masterMulti: 1.05,
                    granMasterMulti: 1.1,
                    perfectMulti: 1.2,
                    scaleWithAtribute: true
                },
            },
        },
    },
}