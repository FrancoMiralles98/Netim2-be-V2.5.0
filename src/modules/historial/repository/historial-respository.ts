import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, type DeleteResult } from 'mongoose';
import { HistorialModel, type HistorialDocument, type StoredHistorial } from '../schema/historial.schema';
import type { HistorialDetalle } from 'netim2-shared';
import { MAX_CHARACTER_HISTORIALS_BY_FILTRO } from '../const/max-character-historials.const';

/** Persiste historiales por propietario y limita la cantidad guardada por categoría. */
@Injectable()
export class HistorialRepository {
    constructor(@InjectModel(HistorialModel.name) private readonly model: Model<HistorialDocument>) {}

    /** Obtiene un detalle perteneciente al personaje solicitado. */
    async getHistorialById(id: string, characterId: string, session?: ClientSession): Promise<StoredHistorial> {
        const historial = await this.model.findOne({ _id: id, characterOwner: characterId }).session(session ?? null).lean();
        if (!historial) throw new NotFoundException('No se encuentra el historial del personaje');
        return historial;
    }

    /** Lista los registros del personaje del más reciente al más antiguo. */
    async getHistorialByCharacterId(characterId: string, filtro?: HistorialDetalle['filtro'],
        session?: ClientSession): Promise<StoredHistorial[]> {
        return this.model.find({ characterOwner: characterId, ...(filtro ? { 'detalles.filtro': filtro } : {}) })
            .sort({ 'detalles.fecha': -1, _id: -1 }).session(session ?? null).lean();
    }

    /** Inserta el historial una sola vez por combate y personaje dentro de la transacción del llamador. */
    async saveHistorial(detalles: HistorialDetalle, characterId: string, session: ClientSession): Promise<StoredHistorial> {
        this.requireTransaction(session);
        const [historial] = await this.model.create([{ characterOwner: characterId, detalles }], { session });
        await this.pruneHistorials(characterId, detalles.filtro, session);
        return historial.toObject();
    }

    /** Conserva los historiales más recientes de la categoría y elimina los excedentes con sus recompensas. */
    async pruneHistorials(characterId: string, filtro: HistorialDetalle['filtro'], session: ClientSession): Promise<void> {
        this.requireTransaction(session);
        const excess = await this.model.find({
            characterOwner: characterId,
            'detalles.filtro': filtro,
        }).sort({ 'detalles.fecha': -1, _id: -1 }).skip(MAX_CHARACTER_HISTORIALS_BY_FILTRO)
            .select('_id').session(session).lean();
        if (!excess.length) return;
        await this.model.deleteMany({
            _id: { $in: excess.map(historial => historial._id) },
            characterOwner: characterId,
            'detalles.filtro': filtro,
        }, { session });
    }

    /** Retira las recompensas confirmadas con una escritura condicionada a que todas sigan pendientes. */
    async confirmRewards(id: string, characterId: string, rewardIds: string[], session: ClientSession): Promise<StoredHistorial> {
        this.requireTransaction(session);
        const historial = await this.model.findOneAndUpdate({
            _id: id, characterOwner: characterId,
            'detalles.rewards.pendingItems.rewardId': { $all: rewardIds },
        }, {
            $pull: { 'detalles.rewards.pendingItems': { rewardId: { $in: rewardIds } } },
        }, { new: true, session }).lean();
        if (!historial) throw new ConflictException('Las recompensas ya fueron reclamadas o no pertenecen al historial');
        await this.pruneHistorials(characterId, historial.detalles.filtro, session);
        return historial;
    }

    /** Borra un registro resuelto y rechaza la pérdida de recompensas pendientes. */
    async deleteHistorialById(id: string, characterId: string): Promise<StoredHistorial> {
        const historial = await this.model.findOneAndDelete({
            _id: id, characterOwner: characterId,
            'detalles.rewards.pendingItems': { $size: 0 },
        }).lean();
        if (!historial) {
            await this.getHistorialById(id, characterId);
            throw new ConflictException('El historial tiene recompensas pendientes o requiere migración');
        }
        return historial;
    }

    /** Elimina solo los historiales resueltos del personaje. */
    async deleteHistorialByCharacterId(characterId: string): Promise<DeleteResult> {
        return this.model.deleteMany({ characterOwner: characterId, 'detalles.rewards.pendingItems': { $size: 0 } });
    }

    /** Exige la transacción que agrupa el historial con las escrituras de Character. */
    private requireTransaction(session: ClientSession): void {
        if (!session.inTransaction()) throw new Error('La operación de historial requiere una transacción activa');
    }
}
