/**
 * @description
 * Se usa para especificar los items espeficios que se cambiaron, puede ser que se consumieron o se agregaron
 * y luego pasarlos al cliente
 * @property {cantidad} - aca el valor es la cantidad FINAL que tiene el item, NO un valor que se suma o se resta
 * - @note - si no se especifica una cantidad se tomara que el item se tiene remover del inventario
 */
export interface InventoryChangeResult {
    id: string,
    cantidad?: number
}