import { StructureCharacterSkillScaling } from "../../types/config/skill-scaling.type";
import { UNIQUE_ID_SKILLS } from "../../types/props/unique-id-skill.enum";

export const GUERRERO_SKILLS_SCALING: StructureCharacterSkillScaling = {
    Corporal: {
        [UNIQUE_ID_SKILLS.CORTE_DE_TRES_MANERAS]: {
            type: "damage",
            cd: 12,
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
                vampirismo_hechizo: {base: 0, perLv: 0},
                desmayo: { base: 0, perLv: 0 },
                veneno: { base: 0, perLv: 0 },
                incendio: { base: 0, perLv: 0 },
                retardo: { base: 0, perLv: 0 },
                sangrado: { base: 7.5, perLv: 1.5 }
            },
            
        },
        [UNIQUE_ID_SKILLS.ROCIADA]: {
            type: "damage",
            cd: 16,
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
                vampirismo_hechizo: {base: 0, perLv: 0},
                desmayo: { base: 100, perLv: 0 },
                veneno: { base: 0, perLv: 0 },
                incendio: { base: 0, perLv: 0 },
                retardo: { base: 0, perLv: 0 },
                sangrado: { base: 0, perLv: 0 }
            },
            
        },
        [UNIQUE_ID_SKILLS.GIRO_DE_ESPADA]: {
            type: "damage",
            cd: 15,
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
                vampirismo_hechizo: {base: 0, perLv: 0},
                desmayo: { base: 0, perLv: 0 },
                veneno: { base: 0, perLv: 0 },
                incendio: { base: 0, perLv: 0 },
                retardo: { base: 0, perLv: 0 },
                sangrado: { base: 0, perLv: 0 }
            },
            
        },
        [UNIQUE_ID_SKILLS.AURA_DE_ESPADA]: {
            type: "aura",
            escaladoAtributos: { STR: 1.5 },
            escaladoBuffos: {
                media: {
                    escaladoLv: {
                        perLv: 1.05,
                        basicMulti: 1,
                        masterMulti: 1.1,
                        granMasterMulti: 1.2,
                        perfectMulti: 1.3,
                    },
                    scaleWithAtribute: true
                },
            },
        },
        [UNIQUE_ID_SKILLS.BERSEK]: {
            type: "aura",
            escaladoAtributos: {},
            escaladoBuffos: {
                va: {
                    escaladoLv: {
                        perLv: 1,
                        basicMulti: 1,
                        masterMulti: 1,
                        granMasterMulti: 1,
                        perfectMulti: 1,
                    },
                    scaleWithAtribute: false
                },
                vm: {
                    escaladoLv: {
                        perLv: 1,
                        basicMulti: 1,
                        masterMulti: 1,
                        granMasterMulti: 1,
                        perfectMulti: 1,
                    },
                    scaleWithAtribute: false
                },
                damage_taken: {
                    escaladoLv: {
                        perLv: 0.54,
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
    Mental: {
        [UNIQUE_ID_SKILLS.PULSO_ESPIRITUAL]: {
            type: "damage",
            cd: 17,
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
                vampirismo_hechizo: {base: 0, perLv: 0},
                desmayo: { base: 0, perLv: 0 },
                veneno: { base: 0, perLv: 0 },
                incendio: { base: 0, perLv: 0 },
                retardo: { base: 0, perLv: 0 },
                sangrado: { base: 0, perLv: 0 }
            },
            
        },
        [UNIQUE_ID_SKILLS.GOLPE]: {
            type: "damage",
            cd: 13,
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
                vampirismo_hechizo: {base: 0, perLv: 0},
                desmayo: { base: 0, perLv: 0 },
                veneno: { base: 0, perLv: 0 },
                incendio: { base: 0, perLv: 0 },
                retardo: { base: 0, perLv: 0 },
                sangrado: { base: 0, perLv: 0 }
            },
            
        },
        [UNIQUE_ID_SKILLS.TOCON]: {
            type: "damage",
            cd: 18,
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
                vampirismo_hechizo: {base: 0, perLv: 0},
                desmayo: { base: 15, perLv: 1 },
                veneno: { base: 0, perLv: 0 },
                incendio: { base: 0, perLv: 0 },
                retardo: { base: 0, perLv: 0 },
                sangrado: { base: 0, perLv: 0 }
            },
            
        },
        [UNIQUE_ID_SKILLS.GOLPE_DE_ESPADA]: {
            type: "damage",
            cd: 14,
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
                vampirismo_hechizo: {base: 0, perLv: 0},
                desmayo: { base: 100, perLv: 0 },
                veneno: { base: 0, perLv: 0 },
                incendio: { base: 0, perLv: 0 },
                retardo: { base: 0, perLv: 0 },
                sangrado: { base: 0, perLv: 0 }
            },
            
        },
        [UNIQUE_ID_SKILLS.CUERPO_FUERTE]: {
            type: "aura",
            escaladoAtributos: { VIT: 1.5, STR: 0.5 },
            escaladoBuffos: {
                def_veneno: {
                    escaladoLv: {
                        perLv: 1,
                        basicMulti: 1,
                        masterMulti: 1,
                        granMasterMulti: 1,
                        perfectMulti: 1,
                    },
                    scaleWithAtribute: false
                },
                def_sangrado: {
                    escaladoLv: {
                        perLv: 1,
                        basicMulti: 1,
                        masterMulti: 1,
                        granMasterMulti: 1,
                        perfectMulti: 1,
                    },
                    scaleWithAtribute: false
                },
                def_incendio: {
                    escaladoLv: {
                        perLv: 1,
                        basicMulti: 1,
                        masterMulti: 1,
                        granMasterMulti: 1,
                        perfectMulti: 1,
                    },
                    scaleWithAtribute: false
                },
                regen_hp: {
                    escaladoLv: {
                        perLv: 0.2,
                        basicMulti: 1.5,
                        masterMulti: 3,
                        granMasterMulti: 4.5,
                        perfectMulti: 6,
                    },
                    scaleWithAtribute: true
                },
            },
        },
    },
}