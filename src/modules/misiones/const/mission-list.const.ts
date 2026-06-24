import { Missions } from "../types/mission-base.type";
import { HUNT_MISSION } from "./hunt-mission.const";
import { MAIN_MISSION } from "./main-mission.const";
import { SECUNDARY_MISSION } from "./secundary-mission.const";

export const MISSION_LIST: Missions[] = [
    ...HUNT_MISSION,
    ...MAIN_MISSION,
    ...SECUNDARY_MISSION
]