import { AttributesRefKeys, CharacterRace } from "netim2-shared";

export const ATTRIBUTE_BASE_BY_RACE: Record<CharacterRace, Record<AttributesRefKeys, number>> = {
    ninja: {
        DEX: 12,
        INT: 6,
        STR: 8,
        VIT: 6
    },
    chaman: {
        DEX: 8,
        INT: 12,
        STR: 6,
        VIT: 6,
    },
    guerrero: {
        DEX: 6,
        INT: 4,
        STR: 12,
        VIT: 10,
    },
    sura: {
        DEX: 6,
        INT: 10,
        STR: 10,
        VIT: 6,
    }
}