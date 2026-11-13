import type { IdMissionsList, MissionOption, MissionProgress } from 'netim2-shared';
import { MISSIONS_BY_ID } from '../../const';

/** Adapta el estado legado de los personajes al formato de intentos y contadores. */
export function readMissionOption(stored: MissionOption | undefined): MissionOption {
    return {
        idMissionsDone: stored?.idMissionsDone ?? [],
        missionsInProgress: (stored?.missionsInProgress ?? []).map(attempt => {
            if ('attemptId' in attempt) {
                return { ...attempt,
                    startedAt: new Date(attempt.startedAt),
                    ...(attempt.expiresAt ? { expiresAt: new Date(attempt.expiresAt) } : {}),
                    ...(attempt.completedAt ? { completedAt: new Date(attempt.completedAt) } : {}),
                };
            }
            return readLegacyAttempt(attempt);
        }),
    };
}

type LegacyAttempt = {
    idMission: IdMissionsList;
    missionProgress?: {
        isDone?: boolean;
        huntsProgress?: { idMob: number; quantity: number }[];
    };
};

/** Recupera los pendientes de caza y las acciones completadas del formato anterior. */
function readLegacyAttempt(raw: unknown): MissionProgress {
    const { idMission, missionProgress } = raw as LegacyAttempt;
    const definition = MISSIONS_BY_ID.get(idMission);
    const objectives = definition?.steps[0].objectives ?? [];
    const objectivesProgress = objectives.flatMap(objective => {
        if (objective.type === 'action' && missionProgress?.isDone) {
            return [{ objectiveId: objective.id, count: objective.quantity }];
        }
        if (objective.type !== 'hunt' || !('mobIds' in objective.target)) return [];
        const idMob = objective.target.mobIds[0];
        const remaining = missionProgress?.huntsProgress?.find(hunt => hunt.idMob === idMob)?.quantity;
        if (remaining === undefined || !Number.isSafeInteger(remaining)) return [];
        return [{ objectiveId: objective.id, count: Math.max(0, Math.min(objective.quantity, objective.quantity - remaining)) }];
    });
    return { missionId: idMission, attemptId: `legacy-${idMission}`, startedAt: new Date(0), objectivesProgress };
}
