import { ATTRIBUTE_RACE_CAPS } from "src/modules/character/const/statsProgress/attribute-race-caps.const";
import { CharacterCreationConfig } from "../types/character-creation.types";
import { ATTRIBUTE_SPECIALITY_CAPS } from "src/modules/character/const/statsProgress/attribute-speciality-caps.const";

export const CHARACTER_CREATION: CharacterCreationConfig[] = [
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
    }
]