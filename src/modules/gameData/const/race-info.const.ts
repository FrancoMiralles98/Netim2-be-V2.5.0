import { ATTRIBUTE_RACE_CAPS } from "src/modules/character/const/statsProgress/attribute-race-caps.const";
import { RaceInfo } from "../types/characterSelection/race-info.types";
import { ATTRIBUTE_SPECIALITY_CAPS } from "src/modules/character/const/statsProgress/attribute-speciality-caps.const";

export const RACE_INFO: RaceInfo[] = [
    {
        raza: 'guerrero',
        especialidades: {
            base: {
                statsLimit: ATTRIBUTE_RACE_CAPS.guerrero
            },
            Corporal: {
                statsLimit: ATTRIBUTE_SPECIALITY_CAPS.Corporal!
            },
            Mental: {
                statsLimit: ATTRIBUTE_SPECIALITY_CAPS.Mental!
            },

        }
    },
    {
        raza: 'chaman',
        especialidades: {
            base: {
                statsLimit: ATTRIBUTE_RACE_CAPS.chaman
            },
            Dragon: {
                statsLimit: ATTRIBUTE_SPECIALITY_CAPS.Dragon!
            },
            Luz: {
                statsLimit: ATTRIBUTE_SPECIALITY_CAPS.Luz!
            },

        }
    },
    {
        raza: 'ninja',
        especialidades: {
            base: {
                statsLimit: ATTRIBUTE_RACE_CAPS.ninja
            },
            Daga: {
                statsLimit: ATTRIBUTE_SPECIALITY_CAPS.Daga!
            },
            Flecha: {
                statsLimit: ATTRIBUTE_SPECIALITY_CAPS.Flecha!
            },

        }
    },
    {
        raza: 'sura',
        especialidades: {
            base: {
                statsLimit: ATTRIBUTE_RACE_CAPS.sura
            },
            MagiaNegra: {
                statsLimit: ATTRIBUTE_SPECIALITY_CAPS.MagiaNegra!
            },
            Espejo: {
                statsLimit: ATTRIBUTE_SPECIALITY_CAPS.Espejo!
            },

        }
    },
]