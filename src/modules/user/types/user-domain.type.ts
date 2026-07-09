import { Inventory } from "src/modules/inventory/entities/inventory.entity";
import { UserEntityProps } from "./base-user-props.type";

export interface UserDomain extends UserEntityProps{
    almacen: Inventory;
    almacenItemShop: Inventory
}