import { IdMobList } from "src/modules/mob/types/id-mob-list.enum";
import { MissionBase } from "./mission-base.type";

export interface HuntMission extends MissionBase {
    type: 'hunt';
    missionProgress:HuntMissionProgress
}

export interface HuntMissionProgress {
    isDone: boolean;
    huntsProgress: HuntsProgress[];

}

export interface HuntsProgress {
    idMob: IdMobList;
    quantity: number;
    name?: string;
}