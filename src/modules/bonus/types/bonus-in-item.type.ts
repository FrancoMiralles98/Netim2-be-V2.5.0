import { allFullNameBonusList, BonusRefKeys } from "netim2-shared";

/**
 * Representa un bonus aplicado a un ítem.
 *
 * Un bonus puede tener:
 * - un valor único (ej: +500 HP)
 * - o un rango (ej: daño 10 - 20 en armas)
 *
 * @property bonusFullName Nombre completo del bonus (para mostrar en UI)
 * @property bonusRef Identificador interno del bonus
 * @property bonusValue Valor del bonus:
 *  - number → valor único
 *  - { min, max } → rango de valores (usado principalmente en armas)
 * @property bonusValueType Tipo de valor del bonus:
 *  - 'flat' → valor plano
 *  - 'porcentage' → valor porcentual
 * 
 *
 * @example
 * // Bonus plano
 * {
 *   bonusFullName: "Max HP",
 *   bonusRef: "max_hp",
 *   bonusValue: 500,
 *   bonusValueType: "flat"
 * }
 * 
 *  @property "origin" De donde viene el bonus,
 *  random => si es algo alatorio
 *  configured => o es algo implicito del item
 */
export interface BonusInItem {
  bonusFullName: allFullNameBonusList;
  bonusRef: BonusRefKeys;
  bonusValue: number | { min: number; max: number };
  bonusValueType: ValueBonusType;
  origin: BonusOrigin
}

export type BonusOrigin = 'configured' | 'random'

/**
 * Representa un bonus especial corrupto.
 *
 * Estos bonus no tienen valor numérico directo,
 * sino que aplican efectos especiales sobre el ítem.
 *
 * @property nameOfBonus Nombre visible del bonus
 * @property refBonus Identificador del tipo de bonus especial
 */
export interface SpecialCorruptBonus {
  nameOfBonus: string;
  refBonus: SpecialCorruptRefBonusNameType;
}

export type SpecialCorruptRefBonusNameType = 'add1Slot' | 'add1Level'

/**
 * Define cómo se interpreta y muestra el valor de un bonus.
 *
 * @property PORCENTAGE Valor porcentual
 *  - Se muestra con símbolo "%"
 *  @example "Velocidad de ataque +15%"
 *
 * @property FLAT Valor plano
 *  - Se muestra sin símbolo adicional
 *  @example "Max HP +500"
 */
export enum ValueBonusType {
  PORCENTAGE = 'porcentage',
  FLAT = 'flat',
}