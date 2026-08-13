import { InventoryItem } from "netim2-shared";
import { UserEntityProps } from "./base-user-props.type";

export interface UserPersistence extends UserEntityProps {
    almacen: InventoryItem[];
    almacenItemShop: InventoryItem[]
}