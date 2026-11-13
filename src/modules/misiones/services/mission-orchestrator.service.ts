import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ClientSession, Connection } from 'mongoose';
import { isDeepStrictEqual } from 'node:util';
import type { CharacterPersistence } from 'netim2-shared';
import { CharacterMapper } from '../../character/mapper/character-mapper';
import { CharacterRepository } from '../../character/repository/character-repository';
import { CharacterBuffService } from '../../character/services/item-use/character-buff.service';
import { MisionesService } from '../misiones.service';
import type {
    AcceptMissionRequest, AcceptMissionResponse, ClaimMissionRequest, ClaimMissionResponse, MissionListResponse,
    RemoveFailedMissionRequest, RemoveFailedMissionResponse,
} from '../types/mission-api.types';
import { getExperienceMissionEvents } from './utils/experience-mission-events';
import { MissionCatalogService } from './mission-catalog.service';
import { MissionProgressService } from './mission-progress.service';
import { MissionRewardService } from './mission-reward.service';

/** Coordina las operaciones autenticadas de misiones y guarda sus cambios en Character. */
@Injectable()
export class MissionOrchestratorService {
    constructor(
        private readonly repository: CharacterRepository,
        private readonly mapper: CharacterMapper,
        private readonly missions: MisionesService,
        private readonly catalog: MissionCatalogService,
        private readonly progress: MissionProgressService,
        private readonly rewards: MissionRewardService,
        private readonly buffs: CharacterBuffService,
        @InjectConnection() private readonly connection: Connection,
    ) {}

    /** Lista misiones disponibles y activas, actualizando pasos que dependen del inventario. */
    list(characterId: string, accountId: string): Promise<MissionListResponse> {
        return this.execute(characterId, accountId, async (character, session, now) => {
            const missionOption = this.progress.register(character, [], now);
            if (missionOption) {
                await this.repository.updateCharacterById(characterId, { mission_option: missionOption }, session);
                character.mission_option = missionOption;
            }
            return this.catalog.list(character, now);
        });
    }

    /** Acepta una misión disponible y persiste su nuevo intento. */
    accept(characterId: string, accountId: string, request: AcceptMissionRequest): Promise<AcceptMissionResponse> {
        return this.execute(characterId, accountId, async (character, session, now) => {
            const updated = this.missions.accept(character, request.missionId, now);
            const mission = await this.catalog.describe(this.catalog.getById(request.missionId), updated, now);
            if (!mission) throw new Error('El intento aceptado no se encuentra en el catálogo');
            await this.repository.updateCharacterById(characterId, { mission_option: updated.mission_option }, session);
            return { mission };
        });
    }

    /** Descarta el intento vencido y devuelve su disponibilidad actual. */
    removeFailed(characterId: string, accountId: string, request: RemoveFailedMissionRequest): Promise<RemoveFailedMissionResponse> {
        return this.execute(characterId, accountId, async (character, session, now) => {
            const updated = this.missions.removeFailed(character, request, now);
            const definition = this.catalog.getById(request.missionId);
            const status = this.progress.status(definition, updated, now);
            await this.repository.updateCharacterById(characterId, { mission_option: updated.mission_option }, session);
            return { missionId: definition.id, status: status === 'available' ? status : null };
        });
    }

    /** Valida los objetivos y guarda las recompensas junto con el registro de cobro. */
    claim(characterId: string, accountId: string, request: ClaimMissionRequest): Promise<ClaimMissionResponse> {
        return this.execute(characterId, accountId, async (character, session, now) => {
            const missionOption = this.progress.register(character, [], now) ?? character.mission_option;
            const prepared = this.missions.prepareClaim({ ...character, mission_option: missionOption }, request, now);
            const definition = this.catalog.getById(request.missionId);
            const entity = this.mapper.toDomain(structuredClone(prepared));
            this.rewards.consume(entity, prepared.inventario, this.progress.requiredDeliveries(definition));
            this.rewards.grant(entity, definition.rewards, character.yang);
            let updated = this.mapper.toPersistence(entity);
            if (updated.lv !== character.lv) updated = this.buffs.refreshBuffs(updated).character;

            const events = getExperienceMissionEvents(character, updated);
            for (const reward of definition.rewards) {
                if (reward.type === 'item') events.push({ type: 'collect', itemId: reward.itemId, quantity: reward.quantity });
            }
            updated.mission_option = this.progress.register(updated, events, now) ?? updated.mission_option;
            const fields = ['lv', 'exp', 'exp_next_lv', 'puntos_atributos', 'puntos_habilidad',
                'atribute_per_lv', 'stats', 'atributos', 'buffos', 'inventario', 'yang'] as const;
            const changes: ClaimMissionResponse['changes'] = Object.fromEntries(fields
                .filter(field => !isDeepStrictEqual(structuredClone(character[field]), updated[field]))
                .map(field => [field, updated[field]]));
            await this.repository.updateCharacterById(characterId, { ...changes, mission_option: updated.mission_option }, session);
            return { missionId: definition.id, idMissionsDone: updated.mission_option.idMissionsDone,
                missionsInProgress: updated.mission_option.missionsInProgress.map(attempt => ({
                    ...attempt, startedAt: attempt.startedAt.toISOString(), expiresAt: attempt.expiresAt?.toISOString(),
                    completedAt: attempt.completedAt?.toISOString(),
                })), changes };
        });
    }

    /** Carga el personaje y confirma la operación bajo una sola transacción. */
    private async execute<T>(characterId: string, accountId: string,
        action: (character: CharacterPersistence, session: ClientSession, now: Date) => Promise<T>): Promise<T> {
        const session = await this.connection.startSession();
        try {
            return await session.withTransaction(async () => {
                const document = await this.repository.getCharacterById(characterId, session);
                if (document.user_owner !== accountId) throw new ForbiddenException('El personaje no pertenece a la cuenta');
                return action(this.mapper.fromDb(document), session, new Date());
            });
        } finally {
            await session.endSession();
        }
    }
}
