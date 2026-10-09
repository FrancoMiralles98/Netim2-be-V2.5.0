/**
 * Multiplicador mínimo aplicado al valor sorteado del bonus.
 * 
 * Representa el porcentaje base que puede alcanzar un bonus
 * en un ítem con el nivel más bajo, itemLv = 1.
 * 
 * Ejemplo:
 * - MIN_MULTIPLIER = 0.5 → se conserva el 50% del roll, con magnitud mínima de 1.
 */
export const MIN_MULTIPLIER = 0.5;

/**
 * Multiplicador de referencia en itemLv = 100 (no es un techo).
 * 
 * El valor sorteado se conserva en nivel 100 y puede superarse en niveles mayores.
 * 
 * Ejemplo:
 * - MAX_MULTIPLIER = 1 → se conserva el 100% del valor sorteado.
 */
export const MAX_MULTIPLIER = 1;

/** Nivel del ítem en el que se conserva el 100 % del roll. */
export const FULL_VALUE_ITEM_LV = 100;

/**
 * Incremento del multiplicador por cada nivel de itemLv.
 * 
 * Define cuánto aumenta el multiplicador del valor sorteado por cada nivel del ítem.
 * 
 * Ejemplo:
 * - SCALING_PER_ITEM_LV = 0.005 → cada nivel de itemLv incrementa un 0.5% 
 *   respecto al roll base; itemLv 110 usa un multiplicador de 1.05.
 * 
 */
export const SCALING_PER_ITEM_LV = 0.005;
