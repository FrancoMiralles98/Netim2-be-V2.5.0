import { CombatAction, FightEvent, FightResult, FightSide } from "netim2-shared";
import { ActionResolution, PeriodicStatusEffectResolution } from "../actionResolution/action-resolution.types";

export interface FighterTurnExecutionResult {
    turnNumber: number;
    actorId: string;

    startTurnResult: { canAct: boolean };

    action: CombatAction;
    resolution: ActionResolution;

    endTurnResult: TurnEndResult;
    side: FightSide

    events: FightEvent[];

    fightFinished: boolean;
    fightResult?: FightResult;
}

export interface TurnEndResult {
    expiredAuraInstanceIds: string[];
    expiredBuffInstanceIds: string[];
    expiredStatusEffectInstanceIds: string[];
}

export interface PeriodicEffectsTurnStartResult {
    effects: PeriodicStatusEffectResolution[];

    totalAppliedDamage: number;

    actorDefeated: boolean;
}