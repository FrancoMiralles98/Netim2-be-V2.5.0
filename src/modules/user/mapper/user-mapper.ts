import { Inventory } from "src/modules/inventory/entities/inventory.entity";
import { UserEntity } from "../entity/user-entity";
import { UserDocument } from "../schema/user-schema";
import { UserPersistence } from "../types/user-persistence.type";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserMapper {
    toDomain(user: UserDocument): UserEntity {
        const userObject = user.toObject()
        return new UserEntity({
            username: userObject.username,
            email: userObject.email,
            role: userObject.role,
            md: userObject.md,
            reino: userObject.reino,
            yang: userObject.yang,
            almacen: new Inventory(userObject.almacen),
            almacenItemShop: new Inventory(userObject.almacenItemShop),
        })
    }

    toPersistence(userEntity: UserEntity): UserPersistence {
        return userEntity.toPrimitives()
    }
}