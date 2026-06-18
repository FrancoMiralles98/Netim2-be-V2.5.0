/**
 * Reglas globales aplicables a los ítems de tipo equipamiento.
 * 
 * @property {number} MAX_CORRUPT_EXPLICIT_BONUS
 * Máxima cantidad de bonus explícitos de tipo "corrupto" que puede tener un ítem.
 *
 * @property {number} MAX_EXPLICIT_BONUS
 * Máxima cantidad total de bonus explícitos que puede tener un ítem.
 *
 * @property {number} MAX_6_7_BONUS
 * Máxima cantidad de bonus especiales
 *
 * @property {number} MAX_ITEM_LV
 * Nivel máximo que puede alcanzar un ítem, itemLv.
 * Este valor se utiliza como límite superior en sistemas de reroll y escalado.
 *
 * @property {number} MIN_ITEM_LV
 * Nivel mínimo permitido para un ítem
 *
 * @note :
 * - itemLv representa el potencial interno del ítem, no el nivel requerido (lvReq).
 */
export const EQUIP_RULES = {
  MAX_CORRUPT_EXPLICIT_BONUS: 3,
  MAX_SPECIAL_PIEDRAS_UPGRADE_LV: 9,
  MAX_NORMAL_PIEDRAS_UPGRADE_LV: 5,
  MAX_NORMAL_UPGRADE_LV: 9,
  MAX_EXPLICIT_BONUS: 5,
  MAX_6_7_BONUS: 2,
  MAX__NORMAL_ITEM_LV: 100,
  MIN_ITEM_LV: 1
} as const;

export const MONUTRA_RULES = {
  HEALING_PER_ITEM: 0.1, //por cada vez que alimentas la montura le curas como max un 10% de su HP MAX
};
