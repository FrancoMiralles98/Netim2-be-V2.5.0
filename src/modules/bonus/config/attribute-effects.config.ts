import { AttributesRefKeys } from "netim2-shared";
import { BonusRefKeys } from "../types/bonusListHelper/ref-bonus-name.type";

/**
 * Configuración de los efectos que aporta cada atributo del personaje sobre las estadisticas
 *
 * Cada atributo modifica una o más stats base del personaje
 * El valor numérico representa cuánto incrementa esa stat por cada punto del atributo
 *
 * Importante:
 * Unicamente en el atributo de VIT, el valor de hp se interpreta como un porcentaje
 * @example
 * - VIT: { hp: 1 }
 *   - Cada punto de VIT otorga +1% de vida maxima
 */
export const ATTRIBUTE_EFFECTS_CONFIG: Record<AttributesRefKeys, Partial<Record<BonusRefKeys, number>>> = {
    VIT: { hp: 1 },
    INT: { ap: 1.5, vh: 0.3 },
    STR: { ad: 2 },
    DEX: { ad: 1, vm: 1 },
}