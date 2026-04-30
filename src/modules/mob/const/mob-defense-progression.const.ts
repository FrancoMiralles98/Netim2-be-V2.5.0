import { BonusDefensaRefKeys } from "src/modules/bonus/types/bonusListHelper/ref-bonus-name.type";

/**
 * Progresiones base de defensa para mobs segun nivel.
 *
 * Cada propiedad representa un tipo de bonus defensivo (def_hab, def_veneno, etc.).
 * 
 * La estructura interna es un objeto donde:
 * - La key representa el umbral de nivel del mob.
 * - El value de la key es la cantidad que se agregara al bonus defensivo.
 *
 * Cada entrada define una franja de nivel acumulativa.
 * 
 * Ejemplo:
 * 15: 5
 * - Los mobs de nivel ≤ 15 tendran un agreado de 5 en ese bonus.
 *
 * - Los valores NO son acumulativos entre si
 * - Se toma el mayor umbral que sea ≤ al nivel del mob
 *
 */
export const MOB_DEFENSE_PROGRESSION: Partial<Record<BonusDefensaRefKeys, Record<number, number>>> = {
    def_hab: {
        10: 0,
        15: 5,
        20: 8,
        25: 12,
        30: 15,
        40: 18,
        50: 22,
        60: 25,
    },
    def_media: {
        10: 0,
        15: 0,
        20: 0,
        25: 0,
        30: 5,
        40: 10,
        50: 15,
        60: 20,
        70: 25,
        80: 30,
    },
    def_sangrado: {
        10: 0,
        15: 0,
        20: 5,
        25: 10,
        30: 15,
        40: 20,
        50: 25,
        60: 30,
    },
    def_veneno: {
        10: 0,
        15: 0,
        20: 5,
        25: 10,
        30: 15,
        40: 20,
        50: 25,
        60: 30,
    },
    def_incendio: {
        10: 0,
        15: 0,
        20: 5,
        25: 10,
        30: 15,
        40: 20,
        50: 25,
        60: 30,
    },
    corta_curacion: {
        10: 0,
        15: 4,
        20: 8,
        25: 12,
        30: 16,
        40: 20,
        50: 24,
        60: 28,
        70: 32,
        80: 36,
        90: 40,
    },
    def_desmayo: {
        10: 3,
        15: 7,
        20: 10,
        25: 13,
        30: 17,
        40: 20,
        50: 23,
        60: 27,
        70: 30,
        80: 33,
        90: 37,
    },
    def_retardo: {
        10: 3,
        15: 7,
        20: 10,
        25: 13,
        30: 17,
        40: 20,
        50: 23,
        60: 27,
        70: 30,
        80: 33,
        90: 37,
    },


}