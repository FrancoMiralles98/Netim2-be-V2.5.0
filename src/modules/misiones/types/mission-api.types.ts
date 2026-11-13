import type {
    CharacterPersistence, IdMissionsList, MissionDefinition, MissionDetailResponse,
    MissionProgress, MissionStatus,
} from 'netim2-shared';

type MissionText = { shortDescription?: string; note?: string };
export type CatalogMission = MissionDefinition & MissionText;

export type MissionProgressResponse = Omit<MissionProgress, 'startedAt' | 'expiresAt' | 'completedAt'> & {
    startedAt: string;
    expiresAt?: string;
    completedAt?: string;
};

export type MissionListEntry = MissionDetailResponse & MissionText & {
    status: MissionStatus;
    progress?: MissionProgressResponse;
};

export type MissionListResponse = {
    available: MissionListEntry[];
    active: MissionListEntry[];
    idMissionsDone: IdMissionsList[];
};

export type AcceptMissionRequest = { missionId: IdMissionsList };
export type MissionAttemptRequest = AcceptMissionRequest & { attemptId: string };
export type ClaimMissionRequest = MissionAttemptRequest;
export type RemoveFailedMissionRequest = MissionAttemptRequest;
export type AcceptMissionResponse = { mission: MissionListEntry };
export type RemoveFailedMissionResponse = { missionId: IdMissionsList; status: 'available' | null };
export type ClaimMissionResponse = {
    missionId: IdMissionsList;
    idMissionsDone: IdMissionsList[];
    missionsInProgress: MissionProgressResponse[];
    changes: Partial<Pick<CharacterPersistence, 'lv' | 'exp' | 'exp_next_lv' | 'puntos_atributos' |
        'puntos_habilidad' | 'atribute_per_lv' | 'stats' | 'atributos' | 'buffos' | 'inventario' | 'yang'>>;
};
