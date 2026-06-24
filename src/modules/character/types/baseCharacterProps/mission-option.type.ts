import { ActionMissionProgress } from "src/modules/misiones/types/action-mission.type";
import { CollectMissionProgress,  } from "src/modules/misiones/types/collect-mission.type";
import { HuntMissionProgress } from "src/modules/misiones/types/hunt-mission.type";
import { IdMissionsList } from "src/modules/misiones/types/idMissions/id-mission-list.enum";
import { TypeMission } from "src/modules/misiones/types/mission-base.type";

export interface MissionOption {
    idMissionsDone: IdMissionsList[];
    missionsInProgress: MissionInCharacter[]
}

export interface MissionInCharacter {
    idMission: IdMissionsList;
    missionProgress: CollectMissionProgress | HuntMissionProgress | ActionMissionProgress
    missionType: TypeMission
}