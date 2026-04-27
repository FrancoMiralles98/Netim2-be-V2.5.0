import { CharacterAttribute, CharacterRace } from "../../types/baseCharacterProps/character-stats.type";

/**
 * Límites máximos de atributos base por raza.
 *
 * @description
 * Define el valor máximo que cada atributo (STR, DEX, INT, VIT)
 * puede alcanzar únicamente mediante progresión por nivel.
 *
 * @note
 * Estos valores NO incluyen bonus externos como:
 * - ítems
 * - buffos
 * - habilidades
 *
 * @example
 * Un guerrero no puede superar 67 STR mediante puntos de nivel,
 * pero puede exceder ese valor con equipo o efectos.
 *
 */
export const ATTRIBUTE_RACE_CAPS: Record<CharacterRace, Record<CharacterAttribute, number>> = {
    chaman: {
        DEX: 47,
        INT: 73,
        STR: 30,
        VIT: 50
    },
    guerrero: {
        DEX: 40,
        INT: 27,
        STR: 67,
        VIT: 67
    },
    ninja: {
        DEX: 65,
        INT: 37,
        STR: 40,
        VIT: 58
    },
    sura: {
        DEX: 40,
        INT: 49,
        STR: 49,
        VIT: 62
    }
}