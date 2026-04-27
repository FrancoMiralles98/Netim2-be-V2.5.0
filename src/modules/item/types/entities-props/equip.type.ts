import { BonusInItem, SpecialCorruptBonus } from 'src/modules/bonus/types/bonus-in-item.type';
import { ItemBaseType } from './item-base.type';
import { PiedrasInItem } from './piedra.type';

/**
 * @description Representa un ítem de tipo "Equip" (equipamiento) dentro del sistema.
 *
 * Un Equip es un ítem que puede ser equipado por un personaje
 * (armas, armaduras, cascos, accesorios, etc.) y puede poseer
 * mejoras, bonus y mecánicas avanzadas como corrupción o
 * propiedades legendarias.
 *
 * @extends ItemBase
 * @property {number} lvReq - Nivel mínimo requerido del personaje para poder equipar el ítem.
 * @property {number} upgradeLv - Nivel actual de mejora del equipamiento. Normalmente va desde 0 hasta `upgradeMax`.
 * @property {number} upgradeMax - Nivel máximo de mejora permitido para este equipamiento.
 * @property {TypeWeapon} [type_weapon] - Tipo específico de arma en caso de que el equipamiento sea un arma
 * (espada, daga, arco, dos_manos, etc.). No aplica a armaduras u otros equipos.
 * @property {number} [priceForge] - Costo base de forja para intentar mejorar el equipamiento.
 * Puede variar según el nivel de mejora.
 * @property {boolean} legendary - Indica si el equipamiento es de tipo legendario.
 * Los objetos legendarios poseen reglas especiales:
 * no se les pueden cambiar los bonus explícitos,
 * solo pueden ser corrompidos y pueden obtener bonus especiales 6/7.
 * @property {Array} itemsForge - Lista de ítems requeridos para realizar una forja o mejora del equipamiento.
 * @property {string[]} restricted - Lista de razas de personaje que pueden utilizar este equipamiento.
 * @property {number} slot - Cantidad de espacios disponibles en el equipamiento para añadir piedras.
 * @property {TypeEquip} type - Tipo general de equipamiento. Define la categoría del objeto dentro del sistema de ítems.
 * @property {number} weight - en peso de los bonus que tiene el item.
 * @property {boolean} especial - Los items especiales es propiedad de del tipo Armas, y tiene mas chances de tener bonus de media y habilidad
 * ejemplo la "Espada Luna Llena"
 * @property {Array} implicitBonus - Bonus implícitos del equipamiento, no se pueden cambiar.
 * @property {Array} explicitBonus - Bonus explícitos del equipamiento.
 * Estos bonus pueden ser rolados, modificados o reemplazados.
 * @property {Array} piedras - Piedras actualmente incrustadas en el equipamiento.
 * Las piedras agregan bonus adicionales al objeto.
 * @property {Array} bonus6_7 - Bonus especiales.
 * @property {Array} corruptExplicitBonus - Bonus explícitos obtenidos a través del proceso de corrupción del equipamiento.
 * @property {Array} corruptImplicitBonus - Bonus implícitos obtenidos a través del proceso de corrupción del equipamiento.
 * @property {Array} corruptSpecialBonus - Bonus especiales del proceso de corrupcion.
 */
export interface EquipType extends ItemBaseType {
  lvReq: number;
  upgradeLv: number;
  type: 'equip';
  upgradeMax: number;
  type_weapon?: TypeWeapon;
  sub_type_equip: subTypeEquip;
  priceForge?: number;
  legendary: boolean;
  itemsForge: [];
  restricted: string[];
  slot: number;
  weight: number;
  especial: boolean;
  implicitBonus: BonusInItem;
  explicitBonus: BonusInItem;
  piedras: PiedrasInItem[];
  bonus6_7: BonusInItem;
  corruptExplicitBonus: BonusInItem;
  corruptImplicitBonus: BonusInItem;
  corruptSpecialBonus: SpecialCorruptBonus[];
}

export type TypeWeapon =
  | 'flecha'
  | 'daga'
  | 'espada'
  | 'dos_manos'
  | 'campana'
  | 'fan';

export type subTypeEquip =
  | 'arma'
  | 'armadura'
  | 'casco'
  | 'brazalete'
  | 'collar'
  | 'pendiente'
  | 'botas'
  | 'escudo';
