import { DungeonInProgressType } from "../../types/baseCharacterProps/dungeon-in-progress.type";

export const BASE_DUNGEON_IN_PROGRESS: DungeonInProgressType = {
    dungeon_logic: undefined,
    hasLost: false,
    isActive: false,
    isCorrupt: false,
    isFinished: false,
    name: "",
    party: [],
    remaining_lives: 0,
    remaining_turns: 0
}