import { FightResult, FightSide } from "netim2-shared";
import { FighterTurnExecutionResult } from "../turns/turn.types";

export interface SideTurnExecutionResult {
    turnNumber: number;
    side: FightSide;

    actions: FighterTurnExecutionResult[];

    fightFinished: boolean;
    fightResult?: FightResult;
}