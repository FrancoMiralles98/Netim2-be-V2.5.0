
/**
 * @description - Hace referencia a las caracteristicas base de todo item del juego
 */
export interface ItemBaseType {
  idItem: number;
  name: string;
  price: number;
  size: Size;
  img: string;
  acc: boolean;
  corrupt?: boolean;
  leyenda?: string;
  position?: Position;
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
