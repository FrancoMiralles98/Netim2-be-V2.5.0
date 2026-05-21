import { subTypeEquip } from "src/modules/item/types/entities-props/equip.type";
import { ValueBonusType } from "../bonus-in-item.type";
import { allFullNameBonusList } from "./bonus-list-full-name.enum";
import { BonusRefKeys } from "./ref-bonus-name.type";

/**
 * Categorías de bonus disponibles en el sistema.
 *
 * Define a qué pool pertenece un bonus y cómo debe ser tratado
 * durante su generación.
 *
 * - `generic` → Bonus estándar que utilizan tiers numéricos (1–4).
 * - `corrupt` → Bonus especiales corruptos con reglas propias.
 * - `bonus6_7` → Bonus especiales de alto nivel (slots 6 y 7).
 */
export type BonusCategory = 'generic' | 'corrupt' | 'bonus6_7'


/**
 * Niveles de tier para bonus genéricos.
 *
 * Representa la calidad o potencia del bonus.
 * A mayor tier, mejores valores dentro de su rango.
 *
 * Solo aplica para bonus de categoría `generic`.
 */
export type BonusTierLv = 1 | 2 | 3 | 4


/**
 * Representa un bonus completo dentro del sistema.
 *
 * @property name - Información de identificación del bonus.
 *
 * @property name.full_name - Nombre visual del bonus mostrado al cliente.
 *
 * @property name.bonus_ref_name - Clave interna utilizada en el código
 * para referenciar el bonus
 *
 * @property name.type_value - Tipo de valor del bonus:
 * - `FLAT` → valor directo
 * - `PORCENTAGE` → valor porcentual
 *
 * @property category - Categoría del bonus, determina el tipo de bonus que pertenece
 *
 * @property tier - Nivel del bonus (solo para categoría `generic`).
 * Define la calidad del bonus cuanto mas mas dificil es de conseguirlo
 * 
 * @property {{min: number, max: number}} values - Rango de valores del bonus [mínimo, máximo].
 * 
 * @property {subTypeEquip[]} valid - Tipos de items que pueden tener este bonus (arma, amadura, botas).
 *
 */


export interface BonusType {
  name: {
    full_name: allFullNameBonusList;
    bonus_ref_name: BonusRefKeys;
    type_value: ValueBonusType;
  };
  category: BonusCategory;
  tier?: BonusTierLv;
  values: { min: number, max: number };
  valid: subTypeEquip[];
}