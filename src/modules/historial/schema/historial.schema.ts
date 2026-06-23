import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HistorialDetalle } from "../types/historial-detalle.type";
import { HydratedDocument } from "mongoose";

@Schema({timestamps: true})
export class HistorialModel {
    @Prop({type: String, required:true})
    characterOwner!: string

    @Prop({type:Object, required: true})
    detalles!: HistorialDetalle
}

export type HistorialDocument = HydratedDocument<HistorialModel>

export const historialSchema = SchemaFactory.createForClass(HistorialModel)