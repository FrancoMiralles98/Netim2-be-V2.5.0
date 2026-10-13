import type { BonusRefKeys } from 'netim2-shared';

/**
 * Mínimos del valor final de cada stat, después de aplicar flat y porcentajes.
 * Ejemplo: def: 0 impide una defensa negativa; vh: -30 permite bajar hasta -30.
 * Las claves ausentes no tienen un mínimo configurado.
 */
export const MIN_BONUS_CONFIG: Partial<Record<BonusRefKeys, number>> = {};
