import { allFullNameBonusList } from "./bonusListHelper/bonus-list-full-name.enum";
import { BonusRefKeys } from "./bonusListHelper/ref-bonus-name.type";

/**
 * Representa los bonus del item
 * @property {string} - nombre completo del bonus
 * @property {Array}
 *  @property {number} 0 : 
 * Es el valor que tiene el bonus, puede ser un valor numerico o un arreglo de 2 valores,
 * esto depende principalemnte con las armas, los valores de los bonus de daño de las armas son 
 * un arreglo , ya que tiene un valor minimo y un valor maximo, para los demas, son siempre un valor
 * unico
 *  @property {string} 1 : Es el nombre de referencia del bonus
 *  @property {string} 2 : es el tipo valor del bonus si es "flat" o "porcentage"
 */
export type BonusInItem = Record<
  allFullNameBonusList,
  [number | [number, number], BonusRefKeys, ValueBonusType]
>;

export interface SpecialCorruptBonus {
  nameOfBonus: string;
  refBonus: SpecialCorruptRefBonusNameType;
}

export type SpecialCorruptRefBonusNameType = 'add1Slot' | 'add1Level'

/**
 * @description
 *   - Indica como se tiene que visualizar el valor, es decir con o sin "%"
 *
 * @property {string} PORCENTAGE - Indica que el valor es porcentual.
 *   - Se debe mostrar con el símbolo "%"
 *   @example
 *   "Velocidad de ataque +15%"
 *
 * @property {string} FLAT - Indica que el valor es plano
 *   - Se muestra tal cual sin símbolo.
 *   @example
 *   "Max HP +500"
 */
export enum ValueBonusType {
  PORCENTAGE = 'porcentage',
  FLAT = 'flat',
}