import { IdItemList } from "../iditems/id-item-list.type";
import { ItemDropConfig } from "./item-drop.config.type";

/**
 * @description - Hace referencia a las caracteristicas base de todo item del juego
 */
export interface ItemBaseType {
  idItem: IdItemList;
  name: string;
  price: number;
  size: Size;
  img: string;
  acc: boolean;
  itemDropConfig?: ItemDropConfig
  corrupt?: boolean;
  leyenda?: string;
  type: GenericType;
}

export interface Size {
  rows: number;
  cols: number;
}

export interface Position {
  row: number;
  col: number;
}

export type GenericType = 'equip' | 'utility';
