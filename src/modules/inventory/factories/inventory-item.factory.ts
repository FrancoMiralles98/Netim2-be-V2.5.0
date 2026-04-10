import { ItemDTO } from "src/modules/item/types/item-dto"
import { InventoryItem, Position } from "../types/inventory-item.type"
import { randomUUID } from "crypto"

/**
 * Factory responsable de crear instancias de items dentro del inventario.
 *
 * Convierte un {@link ItemDTO} en un {@link InventoryItem},
 * asignándole:
 * - un identificador único (`id`)
 * - una posición dentro del inventario (`position`)
 *
 * Esta factory NO valida si la posición es válida.
 * Esa responsabilidad pertenece a la entidad {@link Inventory}.
 *
 */
export class InventoryItemFactory {
    static create(item: ItemDTO, position: Position): InventoryItem {
        return structuredClone({
            ...item,
            id: randomUUID(),
            position
        })
    }
}