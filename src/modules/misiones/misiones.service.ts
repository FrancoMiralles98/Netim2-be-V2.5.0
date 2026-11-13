import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { CharacterPersistence, IdMissionsList, MissionProgress } from 'netim2-shared';
import { randomUUID } from 'node:crypto';
import { MissionCatalogService } from './services/mission-catalog.service';
import { MissionProgressService } from './services/mission-progress.service';
import type { MissionAttemptRequest } from './types/mission-api.types';

/** Aplica las reglas de aceptación, entrega y descarte de intentos. */
@Injectable()
export class MisionesService {
    constructor(
        private readonly catalog: MissionCatalogService,
        private readonly progress: MissionProgressService,
    ) {}

    /** Crea un intento elegible y evalúa sus objetivos iniciales. */
    accept(character: CharacterPersistence, missionId: IdMissionsList, now: Date): CharacterPersistence {
        const definition = this.catalog.getById(missionId);
        if (this.progress.status(definition, character, now) !== 'available') {
            throw new ConflictException('La misión no está disponible');
        }
        const attempt: MissionProgress = { missionId, attemptId: randomUUID(), startedAt: now, objectivesProgress: [] };
        if (definition.timeLimitSeconds !== undefined) {
            attempt.expiresAt = new Date(now.getTime() + definition.timeLimitSeconds * 1000);
        }
        if (definition.sequentialSteps) attempt.activeStepId = definition.steps[0].id;
        const progress = this.progress.advance(definition, attempt, character.inventario, now,
            character.especialidad ? [{ type: 'action', action: {
                event: 'speciality_selected', speciality: character.especialidad,
            } }] : []);
        return { ...character, mission_option: {
            ...character.mission_option, missionsInProgress: [...character.mission_option.missionsInProgress, progress],
        } };
    }

    /** Quita únicamente el intento vencido indicado, para permitir un nuevo intento. */
    removeFailed(character: CharacterPersistence, request: MissionAttemptRequest, now: Date): CharacterPersistence {
        const definition = this.catalog.getById(request.missionId);
        this.requireAttempt(character, request);
        if (this.progress.status(definition, character, now) !== 'failed') {
            throw new ConflictException('La misión no está vencida');
        }
        return this.removeAttempt(character, request.attemptId);
    }

    /** Verifica que el intento esté listo y prepara el registro de cobro. */
    prepareClaim(character: CharacterPersistence, request: MissionAttemptRequest, now: Date): CharacterPersistence {
        const definition = this.catalog.getById(request.missionId);
        if (character.mission_option.idMissionsDone.includes(definition.id)) {
            throw new ConflictException('La recompensa ya fue reclamada');
        }
        this.requireAttempt(character, request);
        if (this.progress.status(definition, character, now) !== 'ready_to_claim') {
            throw new ConflictException('Faltan objetivos o materiales para reclamar la misión');
        }
        const updated = this.removeAttempt(character, request.attemptId);
        updated.mission_option.idMissionsDone = [...character.mission_option.idMissionsDone, definition.id];
        return updated;
    }

    /** Comprueba que el comando se refiera al intento actual. */
    private requireAttempt(character: CharacterPersistence, request: MissionAttemptRequest): void {
        if (!character.mission_option.missionsInProgress.some(progress =>
            progress.missionId === request.missionId && progress.attemptId === request.attemptId)) {
            throw new NotFoundException('No se encuentra el intento de misión');
        }
    }

    /** Retira el intento del estado activo del personaje. */
    private removeAttempt(character: CharacterPersistence, attemptId: string): CharacterPersistence {
        return { ...character, mission_option: {
            ...character.mission_option,
            missionsInProgress: character.mission_option.missionsInProgress.filter(progress => progress.attemptId !== attemptId),
        } };
    }
}
