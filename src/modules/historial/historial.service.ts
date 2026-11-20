import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import type { ClientSession, DeleteResult } from 'mongoose';
import { randomUUID } from 'node:crypto';
import { HistorialRepository } from './repository/historial-respository';
import type { StoredHistorial } from './schema/historial.schema';
import type { CreateHistorialInput, HistorialDetalle, PartialHistorialDetalle } from 'netim2-shared';
import type {
    ClaimHistoryRewardsRequest, ClaimHistoryRewardsResponse, GetHistorialResponse, PreparedHistoryRewards,
} from 'netim2-shared';

/** Prepara y consulta resúmenes de combate y coordina el estado de sus recompensas. */
@Injectable()
export class HistorialService {
    constructor(private readonly repository: HistorialRepository) {}

    /** Construye una copia del resumen y asigna identidades estables a los drops pendientes. */
    createHistorialDetalle(input: CreateHistorialInput): HistorialDetalle {
        if (!input.fightId?.trim() || !['pvm', 'pvp'].includes(input.filtro)) {
            throw new BadRequestException('Identidad o tipo de combate inválido');
        }
        for (const amount of [input.rewards.expGranted, input.rewards.yangGranted]) {
            if (!Number.isSafeInteger(amount) || amount < 0) throw new BadRequestException('Recompensa de recursos inválida');
        }
        const fecha = input.fecha ?? Date.now();
        if (!Number.isSafeInteger(fecha) || fecha < 0) throw new BadRequestException('Fecha de combate inválida');
        const fighterIds = input.fight.map(fighter => fighter.fighterId);
        if (!fighterIds.length || new Set(fighterIds).size !== fighterIds.length) {
            throw new BadRequestException('El resumen debe contener combatientes con IDs únicos');
        }
        if (input.enemies.some(enemy => !fighterIds.includes(enemy.fighterId))) {
            throw new BadRequestException('El enemigo no pertenece al resumen de combate');
        }
        return structuredClone({
            ...input, fecha,
            rewards: {
                ...input.rewards,
                pendingItems: input.rewards.pendingItems.map(item => ({ rewardId: randomUUID(), item })),
            },
        });
    }

    /** Guarda el resumen y los pendientes bajo la transacción que confirmará la liquidación del combate. */
    async saveHistorial(input: CreateHistorialInput, characterId: string, session: ClientSession): Promise<GetHistorialResponse> {
        const stored = await this.repository.saveHistorial(this.createHistorialDetalle(input), characterId, session);
        return this.toResponse(stored);
    }

    /** Lista resúmenes del personaje sin enviar ítems ni estadísticas completas. */
    async getPartialsHistoriales(characterId: string, filtro?: HistorialDetalle['filtro']): Promise<PartialHistorialDetalle[]> {
        const records = await this.repository.getHistorialByCharacterId(characterId, filtro);
        return records.map(record => {
            const { detalles, id } = this.toResponse(record);
            return {
                id, fightId: detalles.fightId, filtro: detalles.filtro, fecha: detalles.fecha,
                enemies: detalles.enemies, result: detalles.result,
                expGranted: detalles.rewards.expGranted, yangGranted: detalles.rewards.yangGranted,
                pendingRewardCount: detalles.rewards.pendingItems.length,
                remainingReward: detalles.rewards.pendingItems.length > 0,
            };
        });
    }

    /** Devuelve los detalles completos de los combates de un personaje. */
    async getHistorialesByCharacterId(characterId: string): Promise<GetHistorialResponse[]> {
        const records = await this.repository.getHistorialByCharacterId(characterId);
        return records.map(record => this.toResponse(record));
    }

    /** Obtiene un historial verificando que corresponda al personaje. */
    async getHistorialById(historialId: string, characterId: string, session?: ClientSession): Promise<GetHistorialResponse> {
        return this.toResponse(await this.repository.getHistorialById(historialId, characterId, session));
    }

    /** Filtra los detalles por categoría y personaje. */
    async getHistorialByFiltro(filtro: HistorialDetalle['filtro'], characterId: string): Promise<GetHistorialResponse[]> {
        const records = await this.repository.getHistorialByCharacterId(characterId, filtro);
        return records.map(record => this.toResponse(record));
    }

    /** Prepara los drops seleccionados para que Character pueda insertarlos en el inventario. */
    async prepareRewards(request: ClaimHistoryRewardsRequest, characterId: string, session: ClientSession): Promise<PreparedHistoryRewards> {
        this.validateRewardIds(request.rewardIds);
        const { detalles } = await this.getHistorialById(request.historialId, characterId, session);
        const rewards = detalles.rewards.pendingItems.filter(reward => request.rewardIds.includes(reward.rewardId));
        if (rewards.length !== request.rewardIds.length) {
            throw new ConflictException('Una recompensa ya fue reclamada o no pertenece al historial');
        }
        return { historialId: request.historialId, rewards };
    }

    /** Confirma los IDs insertados por Character dentro de la misma transacción del inventario. */
    async confirmRewards(request: ClaimHistoryRewardsRequest, characterId: string, session: ClientSession): Promise<ClaimHistoryRewardsResponse> {
        this.validateRewardIds(request.rewardIds);
        const { detalles } = this.toResponse(await this.repository.confirmRewards(
            request.historialId, characterId, request.rewardIds, session,
        ));
        return {
            historialId: request.historialId, claimedRewardIds: [...request.rewardIds],
            pendingItems: detalles.rewards.pendingItems, remainingReward: detalles.rewards.pendingItems.length > 0,
        };
    }

    /** Borra los registros resueltos conservando los pendientes del personaje. */
    deleteHistorialsByCharacterId(characterId: string): Promise<DeleteResult> {
        return this.repository.deleteHistorialByCharacterId(characterId);
    }

    /** Borra un historial resuelto del personaje indicado. */
    async deleteHistorialById(historialId: string, characterId: string): Promise<GetHistorialResponse> {
        return this.toResponse(await this.repository.deleteHistorialById(historialId, characterId));
    }

    /** Rechaza selecciones vacías o duplicadas para evitar confirmaciones ambiguas. */
    private validateRewardIds(rewardIds: string[]): void {
        if (!rewardIds.length || rewardIds.some(id => !id.trim()) || new Set(rewardIds).size !== rewardIds.length) {
            throw new BadRequestException('Debes seleccionar IDs de recompensa únicos');
        }
    }

    /** Serializa el registro y detecta historiales legados que requieren una migración explícita. */
    private toResponse(record: StoredHistorial): GetHistorialResponse {
        if (!record.detalles.fightId || !Array.isArray(record.detalles.fight) ||
            !Array.isArray(record.detalles.rewards?.pendingItems)) {
            throw new ConflictException('El historial usa el formato anterior y requiere migración');
        }
        return { id: record._id.toString(), characterId: record.characterOwner, detalles: structuredClone(record.detalles) };
    }
}
