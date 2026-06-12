import { BuffType } from './entities-props/buff.type';
import { CañaType } from './entities-props/caña.type';
import { CeboType } from './entities-props/cebo.type';
import { ChestType } from './entities-props/chest.type';
import { EquipType } from './entities-props/equip.type';
import { MonturaType } from './entities-props/montura.type';
import { PiedraType } from './entities-props/piedra.type';
import { PocionType } from './entities-props/pocion.type';
import { UtilityType } from './entities-props/utility.type';
/**
 * Tipo para agrupar todas los diferentes equipos que puede estar en el juego
 */
export type ItemDTO =
  | EquipType
  | CañaType
  | MonturaType
  | BuffType
  | PiedraType
  | PocionType
  | CeboType
  | ChestType
  | UtilityType

/**
* Tipo para agrupar todas los objetos de tipo utility
*/
export type UtilityItemDTO = Extract<ItemDTO, {type:'utility'}>
