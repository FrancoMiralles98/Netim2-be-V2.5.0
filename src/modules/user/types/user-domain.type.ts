import { Inventory } from "src/modules/inventory/entities/inventory.entity";
import { BaseUser } from "./base-user-props.type";

export interface UserDomain extends BaseUser{
    almacen: Inventory;
    almacenItemShop: Inventory
}