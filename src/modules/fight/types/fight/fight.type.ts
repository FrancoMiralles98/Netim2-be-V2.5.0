import { FightPhase, FightResult, FightSide, FightStatus } from "netim2-shared";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";
import { SideTurnExecutionResult } from "../side/side.types";


export interface FighterInitiativeResult {
    fighterId: string;
    diceRoll: number;
    tieBreakerRoll?: number
    total: number;
}

export interface CreateFightProps {
    id: string;

    allies: FighterCombatEntity[];
    enemies: FighterCombatEntity[];

    randomSeed: string;

    maxTurns?: number;
}

export interface FightRuntimeState {
    status: FightStatus;
    phase: FightPhase;

    fighters: Map<string, FighterCombatEntity>;

    sides: Record<FightSide, string[]>;

    initiativeResults: FighterInitiativeResult[];
    sideTurnOrder: Record<FightSide, string[]>

    currentSide?: FightSide
    currentActorId?: string;

    turnNumber: number;

    result?: FightResult;
}


export interface FightExecutionResult {
    fightId: string;

    turns: SideTurnExecutionResult[];

    result: FightResult;
}