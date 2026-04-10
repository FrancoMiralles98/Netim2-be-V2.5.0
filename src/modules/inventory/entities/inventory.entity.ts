import { ItemDTO, UtilityItemDTO } from "src/modules/item/types/item-dto";
import { InventoryItem, Position } from "../types/inventory-item.type";
import { isUtilityItem } from "src/modules/shared/types/type-guard";

export class Inventory {
    //espacio total del inventario tanto eje x como y
    private readonly DEFAULT_ROWS = 8;
    private readonly DEFAULT_COLS = 14;

    protected items: InventoryItem[]

    constructor(items: InventoryItem[]) {
        this.items = items
    }

    getItems(): InventoryItem[] {
        return this.items
    }

    getItemById(id: string): InventoryItem {
        const itemToFind = this.items.find(i => i.id === id)
        if (!itemToFind) {
            throw new Error('Item No encontrado')
        }
        return itemToFind
    }

    findItemWithSameId(id: string): boolean {
        return this.items.some(i => i.id === id)
    }

    isStackable(item: InventoryItem): boolean {
        return item.acc
    }

    addItem(item: InventoryItem) {
        if (this.isStackable(item) && isUtilityItem(item)) {
            this.addStackableItem(item)
            return
        }
        this.addNonStackableItem(item)
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

    private addStackableItem(item: UtilityItemDTO) {

    }

    private addNonStackableItem(item: InventoryItem) {
        if (!this.findFirstAvailableSpace(this.items, item)) {
            throw new Error('No hay espacio suficiente')
        }
        if (!item.id || this.findItemWithSameId(item.id)) {
            throw new Error('el item debe tener un id unico')
        }
        this.items.push(item)
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