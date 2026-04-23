export interface MissionOption {
    idMissionsDone: number[];
    missionsInProgress: MissionInCharacter[]
}

export interface MissionInCharacter {
    idMission: number;
    missionProgress: any
    missionType: any
}