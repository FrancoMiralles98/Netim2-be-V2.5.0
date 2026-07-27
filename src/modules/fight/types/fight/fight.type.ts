import { FighterCombatEntity } from "../../entities/fighter-combat.entity";

export type FightPhase =
    | 'setup'
    | 'between_turns'
    | 'turn_start'
    | 'cooldowns'
    | 'aura_upkeep'
    | 'periodic_effects'
    | 'regeneration'
    | 'action_selection'
    | 'action_resolution'
    | 'turn_end'
    | 'finished';

export type FightEndReason =
    | 'fighter_defeated'
    | 'simultaneous_defeat'
    | 'max_turns_reached'
    | 'stalemate';

export interface FightResult {
    outcome: 'winner' | 'draw';

    winnerFighterId?: string;

    defeatedFighterIds: string[];
    survivingFighterIds: string[];

    reason: FightEndReason;

    finishedOnTurn: number;
}

export interface FighterInitiativeResult {
    fighterId: string;
    diceRoll: number;
    tieBreakerRoll?:number
    total: number;
}

export interface CreateFightProps {
    id: string;

    fighters: FighterCombatEntity[];

    randomSeed: string;

    maxTurns?: number;
}

export interface FightRuntimeState {
    status: FightStatus;
    phase: FightPhase;

    fighters: Map<string, FighterCombatEntity>;

    initiativeResults: FighterInitiativeResult[];
    turnOrder: string[];

    currentTurnIndex: number;
    currentActorId?: string;

    turnNumber: number;

    result?: FightResult;
}

export type FightStatus =
    | 'pending'
    | 'in_progress'
    | 'finished';

export interface FightIdentity {
    id: string;
    randomSeed: string;
    maxTurns: number;
}