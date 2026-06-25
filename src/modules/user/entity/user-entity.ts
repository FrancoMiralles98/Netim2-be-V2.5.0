import { UserDomain } from "../types/user-domain.type";
import { UserPersistence } from "../types/user-persistence.type";

export class UserEntity {
    constructor(private props: UserDomain) {}

    toPrimitives (): UserPersistence {
        return {
            ...this.props,
            almacen: this.props.almacen.getInventory(),
            almacenItemShop: this.props.almacenItemShop.getInventory()
        }
    }
}