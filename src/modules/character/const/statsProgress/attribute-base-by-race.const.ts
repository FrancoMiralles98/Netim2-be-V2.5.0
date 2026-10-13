import { AttributesRefKeys, CharacterRace } from "netim2-shared";

export const ATTRIBUTE_BASE_BY_RACE: Record<CharacterRace,Record<AttributesRefKeys, number>> = {
    ninja: {
        DEX: 6,
        INT: 3,
        STR: 4,
        VIT: 3
    },

    chaman: {
        DEX: 4,
        INT: 6,
        STR: 3,
        VIT: 3,
    },

    guerrero: {
        DEX: 3,
        INT: 2,
        STR: 6,
        VIT: 5,
    },

    sura: {
        DEX: 3,
        INT: 5,
        STR: 5,
        VIT: 3,
    }
};