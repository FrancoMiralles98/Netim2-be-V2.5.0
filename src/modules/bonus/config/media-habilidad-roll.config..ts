import { MediaHabilidadRollConfigType } from "../types/media-habilidad-roll-config.type";

/**
 * Configuración de generación de los bonus especiales de tipo media y habilidad
 *
 * Cada bonus se divide en 4 tiers internos, donde:
 * - Cada tier tiene una probabilidad de aparecer
 * - Cada tier define un rango de valores posibles para el bonus
 *
 * @note
 * - Las probabilidades son acumulativas y deben sumar ~100%.
 * - Cuanto mayor es el tier:
 *   - menor probabilidad de aparición
 *   - mayor valor del bonus
 *
 */
export const MEDIA_HABILIDAD_ROLL_CONFIG:MediaHabilidadRollConfigType = {
    media: [
        { tier: 1, probability: 85, minValue: 1, maxValue: 25 },
        { tier: 2, probability: 10, minValue: 26, maxValue: 40 },
        { tier: 3, probability: 4.5, minValue: 41, maxValue: 50 },
        { tier: 4, probability: 0.5, minValue: 51, maxValue: 60 },
    ],
    habilidad: [
        { tier: 1, probability: 85, minValue: 1, maxValue: 12 },
        { tier: 2, probability: 10, minValue: 13, maxValue: 20 },
        { tier: 3, probability: 4.5, minValue: 21, maxValue: 25 },
        { tier: 4, probability: 0.5, minValue: 26, maxValue: 30 },
    ]
}