import { Injectable, NotFoundException } from '@nestjs/common';
import type {
    CharacterPersistence, IdMissionsList, IdMobList, MissionObjective, MissionObjectiveDetail, MissionProgress,
    MissionStep, MissionStepDetail,
} from 'netim2-shared';
import { ITEM_LIST } from '../../item/const/items.const';
import { MobService } from '../../mob/mob.service';
import { MISSION_LIST, MISSIONS_BY_ID } from '../const';
import type { CatalogMission, MissionListEntry, MissionListResponse } from '../types/mission-api.types';
import { MissionProgressService } from './mission-progress.service';
import { MissionRewardService } from './mission-reward.service';

const ITEM_NAMES = new Map(ITEM_LIST.map(item => [item.idItem, item.name]));

/** Consulta el catálogo y arma la vista de misiones del personaje. */
@Injectable()
export class MissionCatalogService {
    constructor(
        private readonly progress: MissionProgressService,
        private readonly rewards: MissionRewardService,
        private readonly mobs: MobService,
    ) {}

    /** Busca una definición por su ID de catálogo. */
    getById(id: IdMissionsList): CatalogMission {
        const mission = MISSIONS_BY_ID.get(id);
        if (!mission) throw new NotFoundException('No se encuentra la misión');
        return mission;
    }

    /** Devuelve las misiones habilitadas y los intentos existentes con sus recompensas. */
    async list(character: CharacterPersistence, now: Date): Promise<MissionListResponse> {
        const result: MissionListResponse = { available: [], active: [], idMissionsDone: character.mission_option.idMissionsDone };
        for (const entry of await this.describeMissions(MISSION_LIST, character, now)) {
            if (entry.status === 'available') result.available.push(entry);
            else if (entry.progress) result.active.push(entry);
        }
        return result;
    }

    /** Arma el detalle visible con contadores, fechas serializadas y recompensas completas. */
    async describe(definition: CatalogMission, character: CharacterPersistence, now: Date): Promise<MissionListEntry | null> {
        const [entry] = await this.describeMissions([definition], character, now);
        return entry ?? null;
    }

    /** Resuelve los mobs visibles en una sola consulta y arma las vistas de misión. */
    private async describeMissions(definitions: readonly CatalogMission[], character: CharacterPersistence,
        now: Date): Promise<MissionListEntry[]> {
        const visible = definitions.flatMap(definition => {
            const status = this.progress.status(definition, character, now);
            return status && status !== 'reward_claimed' ? [{ definition, status }] : [];
        });
        const mobIds = new Set<IdMobList>();
        for (const { definition } of visible) {
            for (const { objectives } of definition.steps) {
                for (const objective of objectives) {
                    if (objective.type === 'hunt' && 'mobIds' in objective.target) {
                        for (const id of objective.target.mobIds) mobIds.add(id);
                    }
                }
            }
        }
        const mobs = mobIds.size ? await this.mobs.getMobsByIdMobs([...mobIds]) : [];
        const mobNames = new Map(mobs.map(mob => [mob.idMob, mob.nombre]));

        return visible.map(({ definition, status }) => {
            const progress = character.mission_option.missionsInProgress.find(attempt => attempt.missionId === definition.id);
            const [first, ...remaining] = definition.steps;
            return {
                ...definition, status, rewards: this.rewards.describe(definition.rewards),
                steps: [this.describeStep(first, mobNames), ...remaining.map(step => this.describeStep(step, mobNames))],
                ...(progress ? { progress: this.describeProgress(definition, progress, character.inventario) } : {}),
            };
        });
    }

    /** Agrega los nombres de catálogo a los objetivos del paso. */
    private describeStep(step: MissionStep, mobNames: ReadonlyMap<IdMobList, string>): MissionStepDetail {
        const objectives = step.objectives.map((objective: MissionObjective): MissionObjectiveDetail => {
            if (objective.type === 'collect') {
                return { ...objective, itemName: ITEM_NAMES.get(objective.itemId) ?? `Ítem #${objective.itemId}` };
            }
            if (objective.type === 'hunt' && 'mobIds' in objective.target) {
                const mobs = objective.target.mobIds.map(idMob => ({
                    idMob, name: mobNames.get(idMob) ?? `Mob #${idMob}`,
                }));
                return { ...objective, mobs };
            }
            return objective;
        });
        return { ...step, objectives };
    }

    /** Incluye el progreso actual de cada objetivo para el frontend. */
    private describeProgress(definition: CatalogMission, progress: MissionProgress,
        inventory: CharacterPersistence['inventario']): NonNullable<MissionListEntry['progress']> {
        return {
            ...progress,
            startedAt: progress.startedAt.toISOString(),
            expiresAt: progress.expiresAt?.toISOString(),
            completedAt: progress.completedAt?.toISOString(),
            objectivesProgress: definition.steps.flatMap(step => step.objectives.map(objective => ({
                objectiveId: objective.id, count: this.progress.objectiveCount(objective, progress, inventory),
            }))),
        };
    }
}
