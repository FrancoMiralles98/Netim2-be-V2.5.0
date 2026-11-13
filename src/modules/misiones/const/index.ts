import { validateMissionDefinition, type IdMissionsList } from 'netim2-shared';
import type { CatalogMission } from '../types/mission-api.types';
import { MAIN_MISSIONS } from './main-mission.const';
import { SIDE_MISSIONS } from './side-mission.const';
import { TUTORIAL_MISSIONS } from './tutorial-mission.const';

export const MISSION_LIST = [...MAIN_MISSIONS, ...SIDE_MISSIONS, ...TUTORIAL_MISSIONS];
export const MISSIONS_BY_ID = new Map<IdMissionsList, CatalogMission>();

for (const mission of MISSION_LIST) {
    validateMissionDefinition(mission);
    if (MISSIONS_BY_ID.has(mission.id)) throw new Error(`ID de misión duplicado: ${mission.id}`);
    if (mission.timeLimitSeconds !== undefined &&
        (!Number.isSafeInteger(mission.timeLimitSeconds) || mission.timeLimitSeconds < 1)) {
        throw new Error(`Duración inválida en la misión ${mission.id}`);
    }
    for (const step of mission.steps) {
        if (!step.objectives.length || step.objectives.some(objective =>
            !Number.isSafeInteger(objective.quantity) || objective.quantity < 1)) {
            throw new Error(`Objetivos inválidos en la misión ${mission.id}, paso ${step.id}`);
        }
    }
    MISSIONS_BY_ID.set(mission.id, mission);
}

for (const mission of MISSION_LIST) {
    if (mission.prerequisites?.claimedMissionIds?.some(id => !MISSIONS_BY_ID.has(id))) {
        throw new Error(`Prerrequisito desconocido en la misión ${mission.id}`);
    }
}
