import { subTypeEquip } from "src/modules/item/types/entities-props/equip.type";
import { ValueBonusType } from "../bonus-in-item.type";
import { allFullNameBonusList } from "./bonus-list-full-name.enum";
import { BonusRefKeys } from "./ref-bonus-name.type";

/**
 * Tipo base que representa la estructura común de todos los bonuses del juego.
 * @property {[number, number]} values - Rango de valores del bonus [mínimo, máximo].
 * @property {subTypeEquip[]} valid - Tipos de items que pueden tener este bonus (arma, amadura, botas).
 */
export interface BonusList {
  values: [number, number];
  valid: subTypeEquip[];
}

/**
 * Estructura interna y a que hace referencia cada porpiedad de las listas de bonus
 * @extends BonusList
 * @property {[allFullNameBonusList, BonusRefKeys, ValueBonusType]} name
 *   @property {TierBonusType} name.0 - Nombre visual del bonus para el cliente.
 *   @property {TierBonusType} name.1 - Clave interna del bouns para referencias en el código.
 *   @property {ValueBonusType.FLAT | ValueBonusType.PORCENTAGE} name.2 - Tipo del valor.
 * @property {number} tier - A que tier pertenece el bonus.
 *  //Se usa para que a la hora de tener que agrupar todas las listas de los bonus en una sola
 *  constante se sepa de que tier viene dicho bouns
 *  @example
 *   en el la carpeta "bonusList" el archivo 'index.ts' se añade el tier para usar en funciones auxiliares
 *   en otros servicios
 */
export interface TierBonusType extends BonusList {
  name: [
    allFullNameBonusList,
    BonusRefKeys,
    ValueBonusType.FLAT | ValueBonusType.PORCENTAGE,
  ];
  tier?: number;
}
