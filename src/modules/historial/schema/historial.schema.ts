import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument, Types } from 'mongoose';
import type { HistorialDetalle } from 'netim2-shared';

/** Guarda el resumen y las recompensas de un combate para un personaje. */
@Schema({ timestamps: true })
export class HistorialModel {
    @Prop({ type: String, required: true })
    characterOwner!: string;

    @Prop({ type: Object, required: true })
    detalles!: HistorialDetalle;
}

export type HistorialDocument = HydratedDocument<HistorialModel>;
export type StoredHistorial = HistorialModel & { _id: Types.ObjectId };
export const historialSchema = SchemaFactory.createForClass(HistorialModel);

historialSchema.index(
    { characterOwner: 1, 'detalles.fightId': 1 },
    { unique: true, partialFilterExpression: { 'detalles.fightId': { $type: 'string' } } },
);
historialSchema.index({ characterOwner: 1, 'detalles.filtro': 1, 'detalles.fecha': -1, _id: -1 });
