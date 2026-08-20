import { FighterInitiativeResult, FightResult, FightSide } from "../../types/fight/fight.type";
import { FightEvent } from "../../types/fightEvents/fight-event.types";
import { SideTurnExecutionResult } from "../../types/side/side.types";
import { FighterCombatStatisticsState } from "../../types/statistics/fighter-combat-statistics.type";

export interface FightProcessedResult {
    result: FightResult;
    initiativeResults: FighterInitiativeResult[]
    turns: SideTurnExecutionResult[];
    fighters: FighterFightSummary[];
    events: FightEvent[];
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