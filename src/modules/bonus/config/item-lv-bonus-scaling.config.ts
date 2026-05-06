/**
 * Multiplicador mínimo aplicado al rango máximo del bonus.
 * 
 * Representa el porcentaje base que puede alcanzar un bonus
 * en un ítem con el nivel más bajo, itemLv = 1.
 * 
 * Ejemplo:
 * - MIN_MULTIPLIER = 0.5 → el bonus puede alcanzar hasta el 50% de su valor máximo.
 */
export const MIN_MULTIPLIER = 0.5;

/**
 * Multiplicador máximo aplicado al rango del bonus
 * 
 * Representa el límite superior que puede alcanzar un bonus
 * cuando el ítem tiene el máximo nivel, itemLv = 100
 * 
 * Ejemplo:
 * - MAX_MULTIPLIER = 1 → el bonus puede alcanzar el 100% de su valor máximo.
 */
export const MAX_MULTIPLIER = 1;

/**
 * Incremento del multiplicador por cada nivel de itemLv.
 * 
 * Define cuánto aumenta el límite máximo del bonus por cada nivel del "itemLv".
 * 
 * Ejemplo:
 * - SCALING_PER_ITEM_LV = 0.005 → cada nivel de itemLv incrementa un 0.5% 
 *   el límite máximo que puede alcanzar el bonus.
 * 
 */
export const SCALING_PER_ITEM_LV = 0.005;