import { FightEvent, FightResult, FightSide } from "netim2-shared";
import { FighterTurnExecutionResult } from "../turns/turn.types";

export interface SideTurnExecutionResult {
    turnNumber: number;
    side: FightSide;

    actions: FighterTurnExecutionResult[];
    events: FightEvent[]
    fightFinished: boolean;
    fightResult?: FightResult;
}