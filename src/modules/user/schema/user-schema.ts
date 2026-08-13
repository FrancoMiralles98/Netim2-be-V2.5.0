import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserRole } from "../types/user-roles.enum";
import { HydratedDocument } from "mongoose";
import { InventoryItem, ReinosNames } from "netim2-shared";

@Schema({ timestamps: true })
export class UserModel {
    @Prop({ type: String, required: true, unique: true })
    username!: string;

    @Prop({ type: Number, default: 0 })
    md!: number;

    @Prop({ type: Number, default: 0 })
    yang!: number;

    @Prop({ type: Array, default: [] })
    almacen!: InventoryItem[];

    @Prop({ type: Array, default: [] })
    almacenItemShop!: InventoryItem[];

    @Prop({ type: String, required: true, unique: true })
    email!: string;

    @Prop({ type: String, default: UserRole.USER })
    role!: UserRole;

    @Prop({ type: String, required: true })
    codigo!: string;

    @Prop({ type: String, required: true })
    password!: string;

    @Prop({ type: String })
    reino!: ReinosNames;
}

export type UserDocument = HydratedDocument<UserModel>

export const userSchema = SchemaFactory.createForClass(UserModel)