import { InventoryItem, Position } from "src/modules/inventory/types/inventory-item.type";
import { UserDomain } from "../types/user-domain.type";
import { UserPersistence } from "../types/user-persistence.type";
import { ItemDTO } from "src/modules/item/types/item-dto";

export class UserEntity {
    constructor(private props: UserDomain) { }

    depositYang(yang: number) {
        this.props.yang += yang
    }

    depositMd(md: number) {
        this.props.md += md
    }

    extractYang(yang: number) {
        if (this.props.yang - yang < 0) {
            throw new Error('No se puede extraer mas yang del que se tiene')
        }
        this.props.yang -= yang
    }

    extractMd(md: number) {
        if (this.props.md - md < 0) {
            throw new Error('No se puede extraer mas md del que se tiene')
        }
        this.props.md -= md
    }

    moveAlmacenItem(id: string, position: Position) {
        this.props.almacen.moveItem(id, position)
    }

    addItemToAlmacen(item: InventoryItem | ItemDTO) {
        this.props.almacen.addItem(item)
    }

    removeItemOfAlmacen(id: string, quantity?: number): InventoryItem {
        return this.props.almacen.removeItemById(id, quantity)
    }

    /** 
     * en el almacenItemShop si o si se retira todo el item
    */
    removeItemOfAlmacenItemShop(id: string): InventoryItem {
        return this.props.almacenItemShop.removeItemById(id)
    }

    addItemToAlmacenItemShop(item: InventoryItem | ItemDTO) {
        this.props.almacenItemShop.addItem(item)
    }

    toPrimitives(): UserPersistence {
        return {
            ...this.props,
            almacen: this.props.almacen.getInventory(),
            almacenItemShop: this.props.almacenItemShop.getInventory()
        }
    }
}