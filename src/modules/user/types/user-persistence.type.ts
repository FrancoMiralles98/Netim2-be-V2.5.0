import { InventoryItem } from "src/modules/inventory/types/inventory-item.type";
import { UserEntityProps } from "./base-user-props.type";

export interface UserPersistence extends UserEntityProps {
    almacen: InventoryItem[];
    almacenItemShop: InventoryItem[]
}