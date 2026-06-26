import { InventoryItem } from "src/modules/inventory/types/inventory-item.type";
import { BaseUser } from "./base-user-props.type";

export interface UserPersistence extends BaseUser {
    almacen: InventoryItem[];
    almacenItemShop: InventoryItem[]
}