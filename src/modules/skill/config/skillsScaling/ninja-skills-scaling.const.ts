import { StructureCharacterSkillScaling } from "../../types/skill-scaling.type";

export const NINJA_SKILLS_SCALING:StructureCharacterSkillScaling = {
    Daga: {
        23: {
            escaladoMain: { min: 0.82, max: 0.86 },
            escaladoLv: {
                perLv: 1.5,
                basicMulti: 2,
                masterMulti: 4,
                granMasterMulti:6,
                perfectMulti: 8
            },
            escaladoAtributos: { DEX: 3, STR: 2 },
            escaladoEfecto: {
                penetracion_habilidad: { base: 0, perLv: 0 },
                desmayo: { base: 0, perLv: 0 },
                veneno: { base: 0, perLv: 0 },
                incendio: { base: 0, perLv: 0 },
                retardo: { base: 0, perLv: 0 },
                sangrado: { base: 0, perLv: 0 }
            },
            escaladoBonusDamage: true
        },
        24: {
            escaladoMain: { min: 0.75, max: 0.75 },
            escaladoLv: {
                perLv: 1.5,
                basicMulti: 2,
                masterMulti: 4,
                granMasterMulti: 6,
                perfectMulti: 8
            },
            escaladoAtributos: { DEX: 2, STR: 1 },
            escaladoEfecto: {
                penetracion_habilidad: { base: 0, perLv: 0 },
                desmayo: { base: 0, perLv: 0 },
                veneno: { base: 1, perLv: 0.4 },
                incendio: { base: 0, perLv: 0 },
                retardo: { base: 0, perLv: 0 },
                sangrado: { base: 0, perLv: 0 }
            },
            escaladoBonusDamage: true
        },
        25: {
            escaladoMain: { min: 1.0, max: 1.13 },
            escaladoLv: {
                perLv: 1.5,
                basicMulti: 2,
                masterMulti: 4,
                granMasterMulti: 6,
                perfectMulti: 8
            },
            escaladoAtributos: { DEX: 3, INT: 8 },
            escaladoEfecto: {
                penetracion_habilidad: { base: 0, perLv: 0 },
                desmayo: { base: 0, perLv: 0 },
                veneno: { base: 30, perLv: 1.5 },
                incendio: { base: 0, perLv: 0 },
                retardo: { base: 0, perLv: 0 },
                sangrado: { base: 0, perLv: 0 }
            },
            escaladoBonusDamage: false
        },
        26: {
            escaladoMain: { min: 1.05, max: 1.27 },
            escaladoLv: {
                perLv: 1.5,
                basicMulti: 2,
                masterMulti: 4,
                granMasterMulti: 6,
                perfectMulti: 8
            },
            escaladoAtributos: { DEX: 3, STR: 2 },
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
        27: {
            escaladoMain: { min: 0.0, max: 0.0 },
            escaladoLv: {
                perLv: 1,
                basicMulti: 1.4,
                masterMulti: 1.8,
                granMasterMulti: 2.2,
                perfectMulti: 2.6
            },
            escaladoAtributos: { },
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
    },
    Flecha: {
        28: {
            escaladoMain: { min: 0.8, max: 0.84 },
            escaladoLv: {
                perLv: 1.5,
                basicMulti: 2,
                masterMulti: 4,
                granMasterMulti: 6,
                perfectMulti: 8
            },
            escaladoAtributos: { DEX: 3, STR: 1 },
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
        29: {
            escaladoMain: { min: 1.0, max: 1.06 },
            escaladoLv: {
                perLv: 1.5,
                basicMulti: 2,
                masterMulti: 4,
                granMasterMulti: 6,
                perfectMulti: 8
            },
            escaladoAtributos: { DEX: 3, STR: 1, INT:1 },
            escaladoEfecto: {
                penetracion_habilidad: { base: 0, perLv: 0 },
                desmayo: { base: 0, perLv: 0 },
                veneno: { base: 0, perLv: 0 },
                incendio: { base: 5, perLv: 2 },
                retardo: { base: 0, perLv: 0 },
                sangrado: { base: 0, perLv: 0 }
            },
            escaladoBonusDamage: false
        },
        30: {
            escaladoMain: { min: 0.61, max: 0.67 },
            escaladoLv: {
                perLv: 1.5,
                basicMulti: 2,
                masterMulti: 4,
                granMasterMulti: 6,
                perfectMulti: 8
            },
            escaladoAtributos: { DEX: 4, STR: 1 },
            escaladoEfecto: {
                penetracion_habilidad: { base: 0, perLv: 0 },
                desmayo: { base: 100, perLv: 0 },
                veneno: { base: 7.5, perLv: 2.5 },
                incendio: { base: 0, perLv: 0 },
                retardo: { base: 0, perLv: 0 },
                sangrado: { base: 0, perLv: 0 }
            },
            escaladoBonusDamage: false
        },
        31: {
            escaladoMain: { min: 0.50, max: 0.50 },
            escaladoLv: {
                perLv: 1.5,
                basicMulti: 2,
                masterMulti: 4,
                granMasterMulti: 6,
                perfectMulti: 8
            },
            escaladoAtributos: { DEX: 2, STR: 2 },
            escaladoEfecto: {
                penetracion_habilidad: { base: 0, perLv: 0 },
                desmayo: { base: 0, perLv: 0 },
                veneno: { base: 0, perLv: 0 },
                incendio: { base: 0, perLv: 0 },
                retardo: { base: 0, perLv: 0 },
                sangrado: { base: 0, perLv: 0 }
            },
            escaladoBonusDamage: true
        },
        32: {
            escaladoAtributos: { },
            escaladoBuffos: {
                vm: {
                    perLv: 2.5,
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