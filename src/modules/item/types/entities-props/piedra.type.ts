import { BonusInItem, SpecialCorruptBonus, ValueBonusType } from 'src/modules/bonus/types/bonus-in-item.type';
import { UtilityBaseType } from './utility-base.type';
import { BonusRefKeys } from 'src/modules/bonus/types/bonusListHelper/ref-bonus-name.type';
import { subTypeEquip } from './equip.type';

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
  specialCorruptBonus?: SpecialCorruptBonus;
  restricted: subTypeEquip[];
}

/**
 * Representa una piedra ya incrustada en un ítem.
 *
 * Contiene tanto la información visual como el bonus que aporta.
 *
 * @property {idItem} - Identificador de la piedra
 * @property {fullItemName} - Nombre completo de la piedra (para mostrar en UI)
 * @property {upgradeLv} - Nivel de mejora de la piedra
 * @property {fullBonusName} - Nombre completo del bonus que otorga (para mostrar en UI)
 * @property {bonusValue} - Valor del bonus aplicado
 * @property {bonusRef} - Identificador interno del bonus
 * @property {bonusType} - Tipo de valor del bonus:
 *  - 'flat' → valor plano
 *  - 'porcentage' → valor porcentual
 * @property {imgUrl} - Ruta o URL de la imagen de la piedra
 */
export interface PiedrasInItem {
  idItem: number;
  fullItemName: string;
  upgradeLv: number;
  fullBonusName: string;
  bonusValue: number;
  bonusRef: BonusRefKeys;
  bonusType: ValueBonusType;
  imgUrl: string;
}

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
