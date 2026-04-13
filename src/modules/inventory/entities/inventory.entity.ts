import { ItemDTO, UtilityItemDTO } from "src/modules/item/types/item-dto";
import { InventoryItem, Position } from "../types/inventory-item.type";
import { isUtilityItem } from "src/modules/shared/types/type-guard";
import { ItemToUpdate } from "../types/item-to-update.types";
import { InventoryItemFactory } from "../factories/inventory-item.factory";
import { AddItemResult } from "../types/inventory-result.types";

export class Inventory {
    //espacio total del inventario tanto eje x como y
    private readonly DEFAULT_ROWS = 8;
    private readonly DEFAULT_COLS = 14;

    protected items: InventoryItem[]

    constructor(items: InventoryItem[]) {
        this.items = items
    }

    getInventory(): InventoryItem[] {
        return this.items
    }

    getItemById(id: string): InventoryItem {
        const itemToFind = this.items.find(i => i.id === id)
        if (!itemToFind) {
            throw new Error('Item No encontrado')
        }
        return itemToFind
    }

    isStackable(item: InventoryItem): boolean {
        return item.acc
    }

    moveItem(id:string, position:Position): InventoryItem {
        const itemToMove = this.items.find(i=> i.id === id)
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
            throw new Error ('Espacio no disponible')
        }
        itemToMove.position = position
        return itemToMove
    }

    addItem(item: InventoryItem):AddItemResult {
        if (this.isStackable(item) && isUtilityItem(item)) {
          return  this.addStackableItem(item)
        }
        return this.addNonStackableItem(item)
    }

    findFirstAvailableSpace(
        inventoryItems: Array<InventoryItem>,
        item: ItemDTO,
        rows: number = this.DEFAULT_ROWS,
        cols: number = this.DEFAULT_COLS,
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

    private addStackableItem(
        item: UtilityItemDTO
    ): AddItemResult {
        let totalQuantity = item.cantidad
        /** Arrelgo para agregar los cambios realizados a los items para luego pasarlos al cliente */
        const updatedItems: ItemToUpdate[] = []
        const sameItems = this.findSameStackItems(item.idItem)
        for (const storedItem of sameItems) {
            if (!isUtilityItem(storedItem)) {
                throw new Error ('Error de tipo de item')
            }
            if (totalQuantity <= 0) break
            const availableQuantity = item.maxCantidad - storedItem.cantidad
            const quantityToAdd = Math.min(availableQuantity,totalQuantity)
            totalQuantity -= quantityToAdd
            storedItem.cantidad += quantityToAdd
            updatedItems.push({id:storedItem.id,cantidad:storedItem.cantidad})
        }
        if (totalQuantity > 0) {
            const position = this.findFirstAvailableSpace(this.items,{
                    ...item,
                    cantidad: totalQuantity
                })
            if (!position) {
                throw new Error ('Error al encontrar un espacio en el inventario')
            }
            const newItem = InventoryItemFactory.create(item,position)
            this.items.push(newItem)
            return {newItems: [newItem],updatedItems}
        }
        return {newItems:[],updatedItems}
    }

    private addNonStackableItem(item: InventoryItem):AddItemResult {
         const position = this.findFirstAvailableSpace(this.items, item)
        if (!position) {
            throw new Error('No hay espacio suficiente en el inventario')
        }
        const newItem = InventoryItemFactory.create(item,position)
        this.items.push(newItem)
        return {newItems:[newItem],updatedItems:[]}
    }

    private findSameStackItems(idItem: number): InventoryItem[] {
        return this.items.filter(i=> i.idItem === idItem)
    }

    /**
     * Verifica si un espacio específico está disponible para un ítem
     * @param item - Ítem que se quiere colocar
     * @param row - Fila de inicio
     * @param col - Columna de inicio
     * @param inventoryItems - Array de ítems en el inventario
     * @param rows - Número total de filas
     * @param cols - Número total de columnas
     * @returns true si el espacio está disponible
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