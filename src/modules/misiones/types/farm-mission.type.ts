import { MissionBase } from "./mission-base.type";
import { IdItemList } from "src/modules/item/types/iditems/id-item-list.type";

export interface FarmMission extends MissionBase {
    type: 'farm';
    missionProgress: FarmMissionProgress
}

export interface FarmMissionProgress {
    isDone: boolean;
    farmProgress: FarmProgress[];
}

export interface FarmProgress {
    idItem: IdItemList;
    quantity: number;
    name?: string;
}