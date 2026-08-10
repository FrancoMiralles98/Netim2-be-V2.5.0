import { ActionResolution, PeriodicStatusEffectResolution } from "../actionResolution/action-resolution.types";
import { CombatAction } from "../combatAction/combat-action.types";
import { FightResult } from "../fight/fight.type";
import { FightEvent } from "../fightEvents/fight-event.types";

export interface TurnExecutionResult {
    turnNumber: number;
    actorId: string;

    startTurnResult: { canAct: boolean };

    action: CombatAction;
    resolution: ActionResolution;

    endTurnResult: TurnEndResult;

    events: FightEvent[]; /**FightEvent */

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