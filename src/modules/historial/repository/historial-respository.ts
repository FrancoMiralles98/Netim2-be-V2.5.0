import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { HistorialDocument, HistorialModel } from "../schema/historial.schema";
import { DeleteResult, Model } from "mongoose";
import { HistorialDetalle } from "../types/historial-detalle.type";
import { MAX_CHARACTER_HISTORIALS_BY_FILTRO } from "../const/max-character-historials.const";

@Injectable()
export class HistorialRepository {
    constructor(
        @InjectModel(HistorialModel.name)
        private historialModel: Model<HistorialDocument>
    ) { }

    async getHistorialById(id: string): Promise<HistorialModel> {
        const historial = await this.historialModel.findById(id).lean()
        if (!historial) {
            throw new NotFoundException('historial not found')
        }
        return historial
    }

    async getHistorialByCharacterId(characterId: string): Promise<HistorialModel[]> {
        return await this.historialModel.find({ characterOwner: characterId }).lean()
    }

    async deleteHistorialById(id: string): Promise<HistorialModel> {
        const historial = await this.historialModel.findByIdAndDelete(id)
        if (!historial) {
            throw new NotFoundException('historial not found')
        }
        return historial
    }

    async deleteHistorialByCharacterId(characterId: string): Promise<DeleteResult> {
        return await this.historialModel.deleteMany({ characterOwner: characterId })
    }

    async getHistorialByFiltro(filtro: HistorialDetalle['filtro'], characterId: string): Promise<HistorialModel[]> {
        return await this.historialModel.find({ characterOwner: characterId, 'detalles.filtro': filtro })
    }

    /**
    * Guarda un nuevo registro de combate en el historial del personaje.
    *
    * Si al insertar el nuevo registro se supera el límite
    * configurado en `MAX_CHARACTER_HISTORIALS`, se eliminará
    * automáticamente el combate más antiguo de esa categoría para mantener
    * únicamente los registros más recientes.
    *
    * El historial recién creado nunca será eliminado durante este proceso.
    *
    * @param detalles Información resumida y resultado completo del combate.
    * @param characterId Identificador del personaje propietario del historial.
    *
    * @returns El registro de historial creado.
    */
    async saveHistorial(detalles: HistorialDetalle,characterId: string): Promise<HistorialModel> {
        const historial = await this.historialModel.create({
            characterOwner: characterId,
            detalles,
        })

        const excedentHistorial = await this.historialModel
            .findOne({
                characterOwner: characterId,
                'detalles.filtro': detalles.filtro,
            })
            .sort({ 'detalles.fecha': -1 })
            .skip(MAX_CHARACTER_HISTORIALS_BY_FILTRO)
            .select('_id')
            .lean()

        if (excedentHistorial) {
            await this.historialModel.deleteOne({
                _id: excedentHistorial._id,
            })
        }

        return historial
    }
}