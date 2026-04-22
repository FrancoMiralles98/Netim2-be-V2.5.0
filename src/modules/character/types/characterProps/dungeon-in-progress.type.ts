import { DungeonNames } from "src/modules/gameData/types/dungeon-names.type";

export interface DungeonInProgressType {
    name: DungeonNames | '';
    remaining_lives: number;
    remaining_turns: number;
    isCorrupt:boolean
    isActive: boolean;
    isFinished:boolean
    hasLost: boolean;
    dungeon_logic: any;
    party: any[]
}