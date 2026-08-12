import { FightResult, FightSide } from "../fight/fight.type";
import { FighterTurnExecutionResult } from "../turns/turn.types";

export interface SideTurnExecutionResult {
    turnNumber: number;
    side: FightSide;

    actions: FighterTurnExecutionResult[];

    fightFinished: boolean;
    fightResult?: FightResult;
}