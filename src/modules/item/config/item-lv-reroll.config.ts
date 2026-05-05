import { ItemLvRerollType } from "../types/item-lv-reroll.type";

/**
 * Configuración del sistema de reroll de itemLv basado en dificultad.
 *
 * Este sistema determina el nivel final itemLv de un ítem segun
 * la distancia entre su nivel requerido, lvReq y el nivel máximo de ItemLv
 * 
 * Se selecciona una configuración de dificultad según esa distancia
 *
 *  Dentro de la dificultad seleccionada, se elige un tier segun la probabiilidad que toque
 *
 * Se genera un valor aleatorio bonusLv dentro del rango del tier que luego se sumara a la base
 
 * Objetivo del sistema:
 * - Ítems de bajo nivel  tienen muy pocas probabilidades de alcanzar itemLv alto
 * - Ítems de alto nivel  tienen más consistencia y chances reales de llegar al máximo.
 */
export const ITEM_LV_REROLL_CONFIG:ItemLvRerollType[] = [
    {
        difficulty: 1,
        minDistance: 1,
        maxDistance: 25,
        tier: [
            { probability: 50, minBonusLv: 1, maxBonusLv: 6 },
            { probability: 35, minBonusLv: 7, maxBonusLv: 12 },
            { probability: 10, minBonusLv: 13, maxBonusLv: 18 },
            { probability: 5, minBonusLv: 19, maxBonusLv: 25 },
        ]
    },
    {
        difficulty: 2,
        minDistance: 26,
        maxDistance: 50,
        tier: [
            { probability: 55, minBonusLv: 1, maxBonusLv: 10 },
            { probability: 35, minBonusLv: 11, maxBonusLv: 25 },
            { probability: 7.5, minBonusLv: 26, maxBonusLv: 37 },
            { probability: 2.5, minBonusLv: 38, maxBonusLv: 50 },
        ]
    },
    {
        difficulty: 3,
        minDistance: 51,
        maxDistance: 75,
        tier: [
            { probability: 60, minBonusLv: 1, maxBonusLv: 18 },
            { probability: 35, minBonusLv: 19, maxBonusLv: 37 },
            { probability: 4, minBonusLv: 38, maxBonusLv: 56 },
            { probability: 1, minBonusLv: 57, maxBonusLv: 75 },
        ]
    },
    {
        difficulty: 4,
        minDistance: 76,
        maxDistance: 100,
        tier: [
            { probability: 65, minBonusLv: 1, maxBonusLv: 25 },
            { probability: 32, minBonusLv: 26, maxBonusLv: 50 },
            { probability: 2.5, minBonusLv: 51, maxBonusLv: 75 },
            { probability: 0.5, minBonusLv: 76, maxBonusLv: 100 },
        ]
    },
] 