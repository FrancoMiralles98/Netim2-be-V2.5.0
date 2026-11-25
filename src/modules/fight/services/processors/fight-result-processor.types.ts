import { FighterFightSummary, FighterInitiativeResult, FightResult } from "netim2-shared";
import { SideTurnExecutionResult } from "../../types/side/side.types";
import type { FightPlaybackPayload } from 'netim2-shared';

export interface FightProcessedResult {
    result: FightResult;
    initiativeResults: FighterInitiativeResult[]
    turns: SideTurnExecutionResult[];
    fighters: FighterFightSummary[];
    events: FightPlaybackPayload;
}

