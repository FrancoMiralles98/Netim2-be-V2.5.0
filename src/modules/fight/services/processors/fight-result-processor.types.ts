import { FighterFightSummary, FighterInitiativeResult, FightPlaybackPayload, FightResult } from "netim2-shared";
import { SideTurnExecutionResult } from "../../types/side/side.types";

export interface FightProcessedResult {
    result: FightResult;
    initiativeResults: FighterInitiativeResult[]
    turns: SideTurnExecutionResult[];
    fighters: FighterFightSummary[];
    events: FightPlaybackPayload;
}

