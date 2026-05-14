/**
 * Define las coordenadas de los iconos de skills dentro del spritesheet del cliente.
 *
 * @description
 * En el cliente, cada clase utiliza una única imagen (spritesheet) que contiene
 * todos los iconos de sus habilidades en distintas versiones según el nivel:
 * - nivel normal (1–16)
 * - Master (M)
 * - Grand Master (G)
 * - Perfect (P)
 *
 * Para renderizar correctamente un icono, es necesario desplazar la imagen
 * en los ejes X e Y (en píxeles) hasta ubicar el recuadro correspondiente.
 *
 * Estas constantes contienen esos desplazamientos fijos.
 */

import { LetterMasteryLv } from "../types/config/letter-mastery-lv.type"

/**
 * Coordenada en el eje Y para cada skill según su `idPosition`.
 *
 * @description
 * Cada skill ocupa una fila específica dentro del spritesheet.
 * Este valor indica cuánto debe desplazarse verticalmente la imagen
 * para ubicar el icono correcto.
 */
export const ICON_POSITION_Y: Record<number,number> = {
    1: 0,
    2: 35,
    3: 72,
    4: 0,
    5: 36,
    6: 71
} 

/**
 * Coordenadas en el eje X para los iconos según el grupo de skills
 * y el nivel/rango de la habilidad.
 *
 * @description
 * Los iconos están organizados en dos grupos horizontales dentro del spritesheet:
 *
 * - Grupo 1  → skills con idPosition ≤ 3
 * - Grupo 2  → skills con idPosition > 3
 *
 * Cada grupo comparte la misma estructura horizontal,
 * pero el desplazamiento cambia según el rango de la skill:
 *
 * - 'number' → nivel normal (1–16)
 * - 'M' → Master
 * - 'G' → Grand Master
 */
export const ICON_POSITION_X:Record<3|6,Record<LetterMasteryLv | 'N',number>> = {
    3: { // idPosition con id <=  3
        'N': 0,
        'M': 37,
        'G': 74,
        'P': 74
    },
    6: { // idPosition > 3 y <= 6
        'N': 112,
        'M': 149,
        'G': 187,
        'P': 187
    },
}