import { Inventory } from "src/modules/inventory/entities/inventory.entity";
import { UserEntity } from "../entity/user-entity";
import { UserModel } from "../schema/user-schema";
import { UserPersistence } from "../types/user-persistence.type";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserMapper {
    toDomain(user:UserModel): UserEntity {
        return new UserEntity({
            ...user,
            almacen: new Inventory(user.almacen),
            almacenItemShop: new Inventory(user.almacenItemShop)
        })
    }

    toPersistence(userEntity: UserEntity):UserPersistence {
        return userEntity.toPrimitives()
    }
}