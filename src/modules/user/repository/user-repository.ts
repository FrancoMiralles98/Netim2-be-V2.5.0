import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserDocument, UserModel } from "../schema/user-schema";
import { ClientSession, Model } from "mongoose";
import { UserMapper } from "../mapper/user-mapper";
import { UserEntity } from "../entity/user-entity";
import { UserPersistence } from "../types/user-persistence.type";

@Injectable()
export class UserRepository {
    constructor(
        @InjectModel(UserModel.name)
        private userModel: Model<UserDocument>,
        private userMapper: UserMapper
    ) { }

    async createUser(user: Partial<UserModel>): Promise<UserModel> {
        return await this.userModel.create(user)
    }

    async findUserById(id: string, session?: ClientSession): Promise<UserEntity> {
        const user = await this.userModel.findById(id, null, { session })
        if (!user) {
            throw new NotFoundException('User not found')
        }
        return this.userMapper.toDomain(user)
    }

    async findUserByUsername(username: string): Promise<UserDocument> {
        const user = await this.userModel.findOne({ username })
        if (!user) {
            throw new NotFoundException('User not found')
        }
        return user
    }

    async findUserByEmail(email: string): Promise<UserDocument> {
        const user = await this.userModel.findOne({ email })
        if (!user) {
            throw new NotFoundException('User not found')
        }
        return user
    }

    async updateUserDataById(id: string, data: Partial<UserPersistence>, session?: ClientSession): Promise<UserModel> {
        const userUpdated = await this.userModel.findByIdAndUpdate(id, { $set: data }, { new: true, session })
        if (!userUpdated) {
            throw new NotFoundException('User not found')
        }
        return userUpdated
    }

    async deletUserById(id: string): Promise<UserModel> {
        const userDeleted = await this.userModel.findByIdAndDelete(id)
        if (!userDeleted) {
            throw new NotFoundException('User not found')
        }
        return userDeleted
    }
}