import { BonusInItem } from "src/modules/bonus/types/bonus-in-item.type";
import { UtilityBaseType } from "./utility-base.type";
import { UpgradeLv } from "../config/general-implicit.type";
import { IdItemList } from "../iditems/id-item-list.type";


/**
 * @description -
 * - hace referencia a los objetos que son una Montura que se puede equipar el jugador
 * @argument type_utility - las monturas el 'type_utility' son especificamente 'montura'
 * @argument monturaLv - el nivel necesario de nivel de montura para poder usarlo, este se consigue en misiones
 * @argument montura - especificacion de los datos de la montura en si
 * @argument special_montura - si la montura es especial o no
 */
export interface MonturaType extends UtilityBaseType {
  type_utility: 'montura';
  monturaLv: number;
  montura: MonturaDescription;
  special_montura: boolean;
}

/**
 * @description -
 * @argument name - Nombre de la montura
 * @argument statusIcon - Icono que mostrara en el perfil de personaje la salud de la montura
 * @argument img - direccion de la imagen del caballo
 * @argument implicitBonus - Efecto que hara la montura cuando este puesta
 * @argument hp - Vida actual de la montura, cada punto de hp equivale a 1 hora en la vida real
 * @argument hpMax - Vida maxima de la montura
 * @argument idItemFood - idItem de la comida compatible con la montura
 * @argument idItemRef - idItem del item que se usa para invocar a la montura
 * @argument itemFood - Estructura del item de la comida
 * @argument itemRevive - Estructura del item que se usa para revivir
 * @argument lastUpdate - Ultima actualizacion que se hizo en la montura
 */
export interface MonturaDescription {
  name: string;
  statusIcon: string;
  img: string;
  implicitBonus: BonusInItem[];
  hp: number;
  maxHp: number;
  exp: number;
  nextExpLv: number;
  maxLv: number;
  lv: UpgradeLv;
  idItemFood?: number;
  idItemRevive?: number;
  idItemRef: IdItemList;
  itemFood?: UtilityBaseType;
  itemRevive?: UtilityBaseType;
  lastUpdate: number;
}
