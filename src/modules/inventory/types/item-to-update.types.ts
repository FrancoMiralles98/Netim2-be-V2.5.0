/**
 * @description
 * Se usa para agregar los datos que cambiaron del item para luego pasarlos al cliente
 * Principalmente cuando se agrega un item y se distribuye la cantidad en items del mismo tipo que 
 * todavia tiene espacio suficiente para almacenar
 */
export interface ItemToUpdate {
    id: string,
    cantidad?: number,
    price?: number
}