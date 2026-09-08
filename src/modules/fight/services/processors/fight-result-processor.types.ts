import { FighterCombatStatisticsState, FighterInitiativeResult, FightEvent, FightPlaybackPayload, FightResult, FightSide } from "netim2-shared";
import { SideTurnExecutionResult } from "../../types/side/side.types";

export interface FightProcessedResult {
    result: FightResult;
    initiativeResults: FighterInitiativeResult[]
    turns: SideTurnExecutionResult[];
    fighters: FighterFightSummary[];
    events: FightPlaybackPayload;
}

export interface FighterFightSummary {
    fighterId: string;
    name: string;
    side: FightSide;

    alive: boolean;

    resources: {
        hp: number;
        mana: number;
    };

    statistics: FighterCombatStatisticsState;
}