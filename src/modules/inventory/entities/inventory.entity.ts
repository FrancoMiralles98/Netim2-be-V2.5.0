import { ItemDTO, UtilityItemDTO } from "src/modules/item/types/item-dto";
import { InventoryItem, Position } from "../types/inventory-item.type";
import { isUtilityItem } from "src/modules/shared/types/type-guard";
import { InventoryChangeResult } from "../types/item-to-update.types";
import { InventoryItemFactory } from "../factories/inventory-item.factory";
import { AddItemResult } from "../types/inventory-result.types";
import { ItemsToConsumeType } from "../types/items-to-consume.types";
import { IdItemList } from "src/modules/item/types/iditems/id-item-list.type";

export class Inventory {
    //espacio total del inventario tanto eje x como y
    private readonly DEFAULT_ROWS = 8;
    private readonly DEFAULT_COLS = 14;

    protected items: InventoryItem[]

    constructor(items: InventoryItem[]) {
        this.items = items
    }

    getInventory(): InventoryItem[] {
        return [...this.items]
    }

    getItemById(id: string): InventoryItem {
        const itemToFind = this.items.find(i => i.id === id)
        if (!itemToFind) {
            throw new Error('Item No encontrado')
        }
        return itemToFind
    }

    removeItemById(id: string): InventoryItem {
        const itemIndex = this.items.findIndex(i => i.id === id)
        if (itemIndex === -1) {
            throw new Error('id item not found')
        }
        const [itemRemoved] = this.items.splice(itemIndex, 1)
        return itemRemoved
    }

    /**
     * @description - metodo para consumir items del inventario
     * @param itemsToConsume {@link ItemsToConsumeType} - para saber el numero que se consumira se 
     * usa la prop "cantidad" en caso de ser utility
     * @returns {@see InventoryChangeResult[]} - arreglo de los items que se actualizaron
     *  - si son de tipo utility - tendra el id correspondiente y su cantidad final ajustada
     * - si No son de utility - unicamente el id del item consumido
     */
    consumeItems(itemsToConsume: ItemsToConsumeType[]): InventoryChangeResult[] {
        const updatedItems: InventoryChangeResult[] = []
        //Se hace en base a un inventario ordenado "asc" para asi priorizar los items que tiene menor stack
        const inventorySorted = this.sortByQuantity('asc')

        for (const item of itemsToConsume) {
            //se busca un item cualquiera del mismo tipo para tener la info para hacer validaciones de si es o no utility 
            const matchedItem = inventorySorted.find(i => i.idItem === item.idItem)
            if (!matchedItem) {
                throw new Error(`idItem: ${item.idItem} not found`)
            }
            //por lo general si es de utility tiene una cantidad , aunque si maxCantidad sea 1
            if (isUtilityItem(matchedItem) && item.cantidad !== undefined) {
                updatedItems.push(...this.consumeStackableItem(item, inventorySorted))
            } else {
                updatedItems.push(...this.consumeNonStackableItem(item, inventorySorted))
            }
        }
        //Se aplican los cambios consumidos al inventario original
        this.applyConsumeResult(updatedItems)

        return updatedItems
    }

    /**
     * @description - mover un item a una posicion especifica del inventairo
     * @param id - item a mover
     * @param position - posicion especifica
     * @returns {InventoryItem} - 
     */
    moveItem(id: string, position: Position): InventoryItem {
        const itemToMove = this.items.find(i => i.id === id)
        if (!itemToMove) {
            throw new Error('Id Item not found')
        }
        const isAvailable = this.isSpaceAvailable(
            itemToMove,
            position.row,
            position.col,
            this.items,
            this.DEFAULT_ROWS,
            this.DEFAULT_COLS
        )
        if (!isAvailable) {
            throw new Error('Espacio no disponible')
        }
        itemToMove.position = position
        return itemToMove
    }

    addItem(item: InventoryItem | ItemDTO): AddItemResult {
        if (isUtilityItem(item)) {
            return this.addStackableItem(item)
        }
        return this.addNonStackableItem(item)
    }

    findFirstAvailableSpace(
        item: ItemDTO,
        rows: number = this.DEFAULT_ROWS,
        cols: number = this.DEFAULT_COLS,
        inventoryItems: Array<InventoryItem> = this.items,
    ): Position | null {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (this.isSpaceAvailable(item, row, col, inventoryItems, rows, cols)) {
                    return { row, col };
                }
            }
        }
        return null;
    }

    /**
     * @description - metodo para aplicar los cambios realizados a los items en el invetario original
     */
    private applyConsumeResult(itemsToUpdate: InventoryChangeResult[]): void {
        for (const item of itemsToUpdate) {
            const storedItem = this.getItemById(item.id)
            if (isUtilityItem(storedItem) && item.cantidad !== undefined) {
                //si su cantidad a ajustar es 0, directamente se elimina del inventario
                if (item.cantidad <= 0) {
                    this.removeItemById(item.id)
                    continue;
                }
                storedItem.cantidad = item.cantidad
            } else {
                this.removeItemById(item.id)
            }
        }
    }

    /**
     * @description - ordena el inventario segun la cantidad que se tenga de los items (utility)
     * @note - se crea una copia del inventario para no alterar el inventario original
     * @returns {InventoryItem[]} COPIA de la original
     */
    private sortByQuantity(order: 'desc' | 'asc'): InventoryItem[] {
        return [...this.items].sort((a, b) => {
            const aHasQuantity = isUtilityItem(a)
            const bHasQuantity = isUtilityItem(b)

            if (!aHasQuantity && !bHasQuantity) return 0;
            if (!aHasQuantity) return 1;
            if (!bHasQuantity) return -1;

            if (order === 'asc') {
                return a.cantidad - b.cantidad;
            } else {
                return b.cantidad - a.cantidad;
            }
        })
    }

    /**
     * @description - metodo para consumir items de tuilidad del mismo tipo o con un id especifico
     * @returns {@see InventoryChangeResult[]} - arreglo de los items especificos a consumir con su cantidad a ajustar
     */
    private consumeStackableItem(item: ItemsToConsumeType, inventory: InventoryItem[]): InventoryChangeResult[] {
        const itemsToUpdate: InventoryChangeResult[] = []
        let totalQuantity = item.cantidad! //se afirma que es number porque se verifico en la validacion
        const sameItems = item.id ?
            inventory.filter(i => i.id === item.id)
            : inventory.filter(i => i.idItem === item.idItem)
            
        if (!sameItems) {
            throw new Error ('No se encuentra items para consumir')
        }
        
        for (const storedItem of sameItems) {
            if (totalQuantity <= 0) break;
            if (!isUtilityItem(storedItem)) {
                throw new Error(`Error al consumir un item idITem: ${storedItem.idItem}, tipo invalido`)
            }
            const quantityToConsume = Math.min(storedItem.cantidad, totalQuantity)
            totalQuantity -= quantityToConsume
            itemsToUpdate.push({ id: storedItem.id, cantidad: storedItem.cantidad - quantityToConsume })
        }
        /*Se lanza error ya que la accion de consumir es para realizar una accion, y si no tiene los suficientes
        materiales no podria realizar dicha accion*/
        if (totalQuantity > 0) {
            throw new Error(`Error al consumir un item: ${item.idItem}, no se logro consumir su totalidad`)
        }
        return itemsToUpdate
    }

    /**
     * @description - metodo para buscar el item que no tiene una cantidad para consumir del inventario
     * @note - si no se especifica el id a eliminar, se eliminara el primer item que coincida con el "idItem"
     * @returns {@see InventoryChangeResult[]} - el id del item a consumir y eliminar del inventario
     */
    private consumeNonStackableItem(item: ItemsToConsumeType, inventory: InventoryItem[]): InventoryChangeResult[] {
        const itemToConsume = item.id ?
            inventory.find(i => i.id === item.id)
            : inventory.find(i => i.idItem === item.idItem)
        if (!itemToConsume) {
            throw new Error('item id not found')
        }
        return [{ id: itemToConsume.id }]
    }

    /**
     * @description - metodo para agregar un item en el que se púede stackear cantidad al inventario
     * @param item - item en cuestion a agregar
     * @returns {@see AddItemResult}
     */
    private addStackableItem(
        item: UtilityItemDTO
    ): AddItemResult {
        let totalQuantity = item.cantidad
        /** Arrelgo para agregar los cambios realizados a los items para luego pasarlos al cliente */
        const updatedItems: InventoryChangeResult[] = []
        const sameItems = this.findSameStackItems(item.idItem)
        //Se fija en el inventario si hay items del mismo tipo (idItem) para agrupar mas cantidad hasta llegar al maximo
        for (const storedItem of sameItems) {
            if (!isUtilityItem(storedItem)) {
                throw new Error('Error de tipo de item')
            }
            if (totalQuantity <= 0) break
            const availableQuantity = item.maxCantidad - storedItem.cantidad
            const quantityToAdd = Math.min(availableQuantity, totalQuantity)
            totalQuantity -= quantityToAdd
            storedItem.cantidad += quantityToAdd
            updatedItems.push({ id: storedItem.id, cantidad: storedItem.cantidad })
        }
        // Si al distribuir con los items del mismo tipo (si es que hubo) y sobra cantidad, se agrega en un nuevo espacio
        if (totalQuantity > 0) {
            const position = this.findFirstAvailableSpace({ ...item, cantidad: totalQuantity })
            if (!position) {
                throw new Error('Error al encontrar un espacio en el inventario')
            }
            const newItem = InventoryItemFactory.create({ ...item, cantidad: totalQuantity }, position)
            this.items.push(newItem)
            return { newItems: [newItem], updatedItems }
        }
        return { newItems: [], updatedItems }
    }

    /**
     * 
     * @description - agrega un item nuevo al inventario
     * verifica si hay espacio disponible , le genera un UUID y le añade la posicion si hay espacio
     * @returns {@see AddItemResult}
     */
    private addNonStackableItem(item: InventoryItem | ItemDTO): AddItemResult {
        const position = this.findFirstAvailableSpace(item)
        if (!position) {
            throw new Error('No hay espacio suficiente en el inventario')
        }
        const newItem = InventoryItemFactory.create(item, position)
        this.items.push(newItem)
        return { newItems: [newItem], updatedItems: [] }
    }

    private findSameStackItems(idItem: IdItemList, inventory = this.items): InventoryItem[] {
        return inventory.filter(i => i.idItem === idItem)
    }

    /**
     * Verifica si un espacio específico está disponible para un ítem
     * @param item - Ítem que se quiere colocar
     * @param row - posocion de la Fila en la que se quiere poner el item 
     * @param col - posicion de la  Columna en la que se quiere poner el item 
     * @param inventoryItems - Array de ítems en el inventario
     * @param rows - Número total de filas del inventario
     * @param cols - Número total de columnas del inventario
     * @returns {boolean} si el espacio está disponible o no
     */
    private isSpaceAvailable(
        item: ItemDTO,
        row: number,
        col: number,
        inventoryItems: Array<InventoryItem>,
        rows: number,
        cols: number,
    ): boolean {
        for (let r = 0; r < item.size.rows; r++) {
            for (let c = 0; c < item.size.cols; c++) {
                const targetRow = row + r;
                const targetCol = col + c;

                // Verifica límites del inventario
                if (targetRow >= rows || targetCol >= cols) {
                    return false;
                }

                // Verifica colisión con otros ítems
                if (
                    inventoryItems.some(
                        (otherItem) =>
                            otherItem.position &&
                            targetRow >= otherItem.position.row &&
                            targetRow < otherItem.position.row + otherItem.size.rows &&
                            targetCol >= otherItem.position.col &&
                            targetCol < otherItem.position.col + otherItem.size.cols,
                    )
                ) {
                    return false;
                }
            }
        }
        return true;
    }
}