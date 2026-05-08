import { StructureCharacterSkillScaling } from "../../types/skill-scaling.type";

export const GUERRERO_SKILLS_SCALING: StructureCharacterSkillScaling = {
    Corporal: {
        13: { //corte de 3 maneras
            type: "damage",
            escaladoMain: { min: 0.85, max: 0.85 },
            escaladoLv: {
                perLv: 1.5,
                basicMulti: 2,
                masterMulti: 4,
                granMasterMulti: 6,
                perfectMulti: 8
            },
            escaladoAtributos: { STR: 3, DEX: 2 },
            escaladoEfecto: {
                penetracion_habilidad: { base: 0, perLv: 0 },
                desmayo: { base: 0, perLv: 0 },
                veneno: { base: 0, perLv: 0 },
                incendio: { base: 0, perLv: 0 },
                retardo: { base: 0, perLv: 0 },
                sangrado: { base: 7.5, perLv: 1.5 }
            },
            escaladoBonusDamage: false
        },
        14: { //rociada
            type: "damage",
            escaladoMain: { min: 1.0, max: 1.0 },
            escaladoLv: {
                perLv: 1.5,
                basicMulti: 2,
                masterMulti: 4,
                granMasterMulti: 6,
                perfectMulti: 8
            },
            escaladoAtributos: { STR: 1, DEX: 3 },
            escaladoEfecto: {
                penetracion_habilidad: { base: 0, perLv: 0 },
                desmayo: { base: 100, perLv: 0 },
                veneno: { base: 0, perLv: 0 },
                incendio: { base: 0, perLv: 0 },
                retardo: { base: 0, perLv: 0 },
                sangrado: { base: 0, perLv: 0 }
            },
            escaladoBonusDamage: false
        },
        15: { //giro de espada
            type: "damage",
            escaladoMain: { min: 1.20, max: 1.33 },
            escaladoLv: {
                perLv: 1.5,
                basicMulti: 2,
                masterMulti: 4,
                granMasterMulti: 6,
                perfectMulti: 8
            },
            escaladoAtributos: { STR: 3, DEX: 1 },
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
        17: { //aura de espada
            type: "aura",
            escaladoAtributos: { STR: 1.5 },
            escaladoBuffos: {
                media: {
                    perLv: 1.05,
                    basicMulti: 1,
                    masterMulti: 1.1,
                    granMasterMulti: 1.2,
                    perfectMulti: 1.3,
                    scaleWithAtribute: true
                },
            },
        },
        16: { //bersek
            type: "aura",
            escaladoAtributos: {},
            escaladoBuffos: {
                va: {
                    perLv: 1,
                    basicMulti: 1,
                    masterMulti: 1,
                    granMasterMulti: 1,
                    perfectMulti: 1,
                    scaleWithAtribute: false
                },
                vm: {
                    perLv: 1,
                    basicMulti: 1,
                    masterMulti: 1,
                    granMasterMulti: 1,
                    perfectMulti: 1,
                    scaleWithAtribute: false
                },
                damage_taken: {
                    perLv: 0.54,
                    basicMulti: 1,
                    masterMulti: 1,
                    granMasterMulti: 1,
                    perfectMulti: 1,
                    scaleWithAtribute: false
                },
            },
        },
    },
    Mental: {
        18: { //pulso espiritual
            type: "damage",
            escaladoMain: { min: 1.04, max: 1.16 },
            escaladoLv: {
                perLv: 1.5,
                basicMulti: 2,
                masterMulti: 4,
                granMasterMulti: 6,
                perfectMulti: 8
            },
            escaladoAtributos: { STR: 2, VIT: 6 },
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
        19: { //golpe
            type: "damage",
            escaladoMain: { min: 0.83, max: 1.03 },
            escaladoLv: {
                perLv: 1.5,
                basicMulti: 2,
                masterMulti: 4,
                granMasterMulti: 6,
                perfectMulti: 8
            },
            escaladoAtributos: { STR: 4, VIT: 2 },
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
        20: { //tocon
            type: "damage",
            escaladoMain: { min: 0.83, max: 0.87 },
            escaladoLv: {
                perLv: 1.5,
                basicMulti: 2,
                masterMulti: 4,
                granMasterMulti: 6,
                perfectMulti: 8
            },
            escaladoAtributos: { STR: 2, VIT: 2, DEX: 2 },
            escaladoEfecto: {
                penetracion_habilidad: { base: 0, perLv: 0 },
                desmayo: { base: 15, perLv: 1 },
                veneno: { base: 0, perLv: 0 },
                incendio: { base: 0, perLv: 0 },
                retardo: { base: 0, perLv: 0 },
                sangrado: { base: 0, perLv: 0 }
            },
            escaladoBonusDamage: false
        },
        21: { //golpe de espada
            type: "damage",
            escaladoMain: { min: 0.70, max: 0.80 },
            escaladoLv: {
                perLv: 1.50,
                basicMulti: 2,
                masterMulti: 4,
                granMasterMulti: 6,
                perfectMulti: 8
            },
            escaladoAtributos: { STR: 2, DEX: 2, INT: 4 },
            escaladoEfecto: {
                penetracion_habilidad: { base: 0, perLv: 0 },
                desmayo: { base: 100, perLv: 0 },
                veneno: { base: 0, perLv: 0 },
                incendio: { base: 0, perLv: 0 },
                retardo: { base: 0, perLv: 0 },
                sangrado: { base: 0, perLv: 0 }
            },
            escaladoBonusDamage: false
        },
        22: { //cuerpo fuerte
            type: "aura",
            escaladoAtributos: { VIT: 1.5, STR: 0.5 },
            escaladoBuffos: {
                def_veneno: {
                    perLv: 1,
                    basicMulti: 1,
                    masterMulti: 1,
                    granMasterMulti: 1,
                    perfectMulti: 1,
                    scaleWithAtribute: false
                },
                def_sangrado: {
                    perLv: 1,
                    basicMulti: 1,
                    masterMulti: 1,
                    granMasterMulti: 1,
                    perfectMulti: 1,
                    scaleWithAtribute: false
                },
                def_incendio: {
                    perLv: 1,
                    basicMulti: 1,
                    masterMulti: 1,
                    granMasterMulti: 1,
                    perfectMulti: 1,
                    scaleWithAtribute: false
                },
                regen_hp: {
                    perLv: 0.2,
                    basicMulti: 1.5,
                    masterMulti: 3,
                    granMasterMulti: 4.5,
                    perfectMulti: 6,
                    scaleWithAtribute: true
                },
            },
        },
    },
}