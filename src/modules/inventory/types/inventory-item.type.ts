import { ItemDTO } from "src/modules/item/types/item-dto";

/**
 * @description
 * @property {id} - identificacion unica del item, a diferencia del idItem (que identifica el tipo del item)
 * este se usa para poder indetificar el item especifico aunque hayan otros items del mismo tipo (idItem)
 * @property {position} - posicion en el que esta ubicado el item en el inventario
 * @property {@link ItemDTO} - posicion en el que esta ubicado el item en el inventario
 */
export type InventoryItem = ItemDTO & {
    id: string
    position: Position
}

/**
 * @description
 * posicion del eje y con del eje x que se encuentra ubicado el item en el inventario
 */
export interface Position {
  row: number;
  col: number;
}