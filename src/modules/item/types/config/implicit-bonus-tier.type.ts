/**
 * Tier de bonus implícitos utilizado para clasificar equipamientos
 * según su nivel requerido (`lvReq`).
 *
 * Cada tier determina
 * - La cantidad de bonus implícitos que puede tener el ítem.
 * - Los patrones de escalado disponibles para dichos bonus.
 */
export type ImplicitBonusTierType = 1 | 2 | 3