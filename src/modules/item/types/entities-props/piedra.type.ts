import { BonusInItem, SpecialCorruptBonus } from 'src/modules/bonus/types/bonus-in-item.type';
import { GenericType } from './item-base.type';
import { UtilityBaseType } from './utility-base.type';

/**
 * @description - Hace referencia a los objetos que son de utilidad en este caso las Piedras
 * que contienen bonus que se pueden añadir al equipo, es un hibrido entre un objeto de utilidad
 * y un objeto Equipo, ya que comparte algunas caracteristicas de cada uno 
 */
export interface PiedraType extends UtilityBaseType {
  implicitBonus: BonusInItem;
  upgradeLv: number;
  upgradeMax: number;
  type_utility: 'piedra';
  priceForge: number[];
  itemsForge: UtilityBaseType[];
  specialCorruptBonus: SpecialCorruptBonus;
  restricted: GenericType[];
}

/**
 * Representa la piedra en el item cuando ya esta incrustada.
 * @property {number} 0 - ID de la piedra
 * @property {string} 1 - Nombre completo de la piedra
 * @property {number} 2 - Valor de mejora de la piedra
 * @property {string} 3 - Nombre completo del bonus que se mostrará al cliente
 * @property {Array} 4 - Array del bonus:
 *   @property {number} 0 - Valor del bonus
 *   @property {string} 1 - Nombre de referencia del bonus
 *   @property {string} 2 - Tipo de bonus ("porcentaje" o "flat")
 * @property {string} 5 - Ruta de la imagen de la piedra
 */
export type PiedrasOfItem = [
  number,
  string,
  number,
  string,
  [number | [number, number], string, string],
  string,
];

/**
 * @description - Si la piedra falla se añade un tipo diferente de piedra
 * que es la piedra rota que no se pude añadir satisfactoriamente
 * @property {Array}
 *  @property {number} index0 - id de la piedra (como no existe se pone 0)
 *  @property {string} index1 - Nombre de la piedra
 *  @property {string} index2 - Nombre completo del bonus (en este caso sin efecto)
 *  @property {string} index3 - url de la foto de la piedra rota
 */
export type PiedraRota = [0, 'Trozo de Piedra Rota', 'Sin Efecto', string];
