import { BonusTierLv } from "netim2-shared";

/**
 * Modificadores de peso según el tier del bonus.
 *
 * Este sistema se utiliza para calcular el peso de un bonus
 * en función de:
 *
 * 1. Qué tan alto fue el roll dentro de su rango posible.
 * 2. El tier del bonus obtenido.
 *
 * Ejemplo:
 * - Bonus 1–10, roll = 10 → ratio = 1
 * - Tier 4 → modifier = 6
 * - Resultado: weight = 6
 */
export const WEIGHT_RARITY_MODIFIERS_CONFIG: Record<BonusTierLv,number> = {
    1: 0.8,
    2: 1.2,
    3: 3,
    4: 6
}