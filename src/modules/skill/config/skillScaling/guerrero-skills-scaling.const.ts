import { UNIQUE_ID_SKILLS } from "netim2-shared";
import { StructureSkillScaling } from "../../types/structureSkillScaling.types";
import { ESCALADO_LV_DEFAULT } from "../escaladoLvDefault";

export const GUERRERO_SKILLS_SCALING: StructureSkillScaling = {
    Corporal: {
        [UNIQUE_ID_SKILLS.CORTE_DE_TRES_MANERAS]: {
            type: "damage",
            cd: { onActivate: 1 },
            components: [{
                damageType: 'ad',
                escaladoLv: ESCALADO_LV_DEFAULT,
                escaladoMain: { min: 1, max: 2 },

                tags: ['ad', 'melee', 'sangrado', 'weapon', 'skill'],
                escaladoAtributos: {
                    STR: 1,
                    VIT: 1
                }
            }],
            mana: {
                base: 1,
                perLv: 1
            },
            hitModifiersScaling: {
                type: 'chance_multi_hit',
                chancesConfig: {
                    base: 100,
                    per_lv: 0
                },
                damageMultiplierPerHitConfig: {
                    base: 1,
                    perLv: 0
                },
                hitsConfig: {
                    base: 3,
                    perLv: 0
                }
            }
        },
        [UNIQUE_ID_SKILLS.ROCIADA]: {
            type: 'damage',
            cd: { onActivate: 1 },
            components: [{
                damageType: 'ad',
                escaladoLv: ESCALADO_LV_DEFAULT,
                escaladoMain: { min: 1, max: 2 },

                tags: ['ad', 'cc', 'melee', 'weapon', 'skill'],
                escaladoAtributos: {
                    STR: 1,
                    DEX: 1
                },
                statsScaling: [{
                    target: 'general.vm',
                    stat: 'vm',
                    base: 1,
                    perLv: 0.1
                }]
            }],
            mana: {
                base: 1,
                perLv: 1
            },
            statusEffectScaling: {
                desmayo: { base: 60, perLv: 1 }
            },
        },
        [UNIQUE_ID_SKILLS.GIRO_DE_ESPADA]: {
            type: "damage",
            cd: { onActivate: 1 },
            components: [{
                damageType: 'ad',
                escaladoLv: ESCALADO_LV_DEFAULT,
                escaladoMain: { min: 1, max: 1 },

                tags: ['ad', 'melee', 'skill'],
                escaladoAtributos: {
                    VIT: 1,
                    STR: 1,
                    DEX: 1
                }
            }],
            mana: { base: 1, perLv: 1 },
        },
        [UNIQUE_ID_SKILLS.AURA_DE_ESPADA]: {
            type: "aura",
            cd: { onDeactivate: 1 },
            duration: { base: 1, perLv: 1 },
            mana: { base: 1, perLv: 1 },
            escaladoAtributos: { STR: 1.5 },
            escaladoStatsModifiers: []
        },
        [UNIQUE_ID_SKILLS.BERSEK]: {
            type: "aura",
            cd: { onDeactivate: 1 },
            duration: { base: 1, perLv: 1 },
            mana: { base: 1, perLv: 1 },
            escaladoAtributos: {},
            escaladoStatsModifiers: []
        },
    },
    Mental: {
        [UNIQUE_ID_SKILLS.PULSO_ESPIRITUAL]: {
            type: 'damage',
            cd: { onActivate: 1 },
            components: [{
                damageType: 'ad',
                escaladoLv: ESCALADO_LV_DEFAULT,
                escaladoMain: { min: 1, max: 1 },

                tags: ['ad', 'melee', 'weapon', 'skill'],
                escaladoAtributos: { STR: 1, VIT: 1, INT: 1 }
            }],
            mana: { base: 1, perLv: 1 },
            mechanicsEffectScaling: {
                penetracion_habilidad: { base: 1, perLv: 1 }
            },
        },
        [UNIQUE_ID_SKILLS.GOLPE]: {
            type: 'damage',
            cd: { onActivate: 1 },
            components: [{
                damageType: 'ad',
                escaladoLv: ESCALADO_LV_DEFAULT,
                escaladoMain: { min: 1, max: 1 },

                tags: ['ad', 'melee', 'weapon', 'skill'],
                escaladoAtributos: { STR: 1, DEX: 1 }
            }],
            mana: { base: 1, perLv: 1 },
            statusEffectScaling: {
                retardo: { base: 10, perLv: 1 }
            },
        },
        [UNIQUE_ID_SKILLS.TOCON]: {
            type: 'damage',
            cd: { onActivate: 1 },
            components: [{
                damageType: 'ad',
                escaladoLv: ESCALADO_LV_DEFAULT,
                escaladoMain: { min: 1, max: 1 },

                tags: ['ad', 'melee', 'weapon', 'skill'],
                escaladoAtributos: { STR: 1, VIT: 1 }
            }],
            mana: { base: 1, perLv: 1 },
            statusEffectScaling: {
                desmayo: { base: 10, perLv: 1 }
            },
        },
        [UNIQUE_ID_SKILLS.GOLPE_DE_ESPADA]: {
            type: 'damage',
            cd: { onActivate: 1 },
            components: [{
                damageType: 'ap',
                escaladoLv: ESCALADO_LV_DEFAULT,
                escaladoMain: { min: 1, max: 1 },

                tags: ['ap', 'ranged', 'cc', 'weapon', 'skill'],
                escaladoAtributos: { INT: 1, VIT: 1 }
            }],
            mana: { base: 1, perLv: 1 },
            statusEffectScaling: {
                desmayo: { base: 100, perLv: 0 }
            },
        },
        [UNIQUE_ID_SKILLS.CUERPO_FUERTE]: {
            type: "aura",
            cd: { onDeactivate: 1 },
            duration: { base: 1, perLv: 1 },
            mana: { base: 1, perLv: 1 },
            escaladoAtributos: { VIT: 1.5, STR: 0.5 },
            escaladoStatsModifiers: []
        },
    },
}