import { CharacterAttribute, CharacterSpeciality } from "../../types/baseCharacterProps/character-stats.type";

/**
 * Límites máximos de atributos por especialidad.
 *
 * @description
 * Define el valor máximo que cada atributo (STR, DEX, INT, VIT)
 * puede alcanzar mediante progresión por nivel (puntos_atributos) una vez elegida
 * una especialidad.
 *
 * @note
 * Estos valores amplían los límites base de la raza.
 *
 * @note
 * No incluyen bonus externos como que puede exceder ese valor:
 * - ítems
 * - buffos
 * - habilidades
 * 
 */
export const ATTRIBUTE_SPECIALITY_CAPS: Partial<Record<CharacterSpeciality, Record<CharacterAttribute, number>>> = {
    Luz: {
        DEX: 87,
        INT: 128,
        STR: 52,
        VIT: 83
    },
    Dragon: {
        DEX: 60,
        INT: 108,
        STR: 85,
        VIT: 97
    },
    Corporal: {
        DEX: 85,
        INT: 47,
        STR: 117,
        VIT: 102
    },
    Mental: {
        DEX: 50,
        INT: 72,
        STR: 102,
        VIT: 122
    },
    Daga: {
        DEX: 115,
        INT: 73,
        STR: 65,
        VIT: 97
    },
    Flecha: {
        DEX: 120,
        INT: 57,
        STR: 85,
        VIT: 88
    },
    Espejo: {
        DEX: 60,
        INT: 79,
        STR: 99,
        VIT: 112
    },
    MagiaNegra: {
        DEX: 60,
        INT: 112,
        STR: 79,
        VIT: 99
    }
}