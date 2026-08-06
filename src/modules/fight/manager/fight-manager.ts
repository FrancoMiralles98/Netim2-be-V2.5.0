import { Injectable } from "@nestjs/common";
import { TurnManager } from "./turn-manager";
import { FightEntity } from "../entities/fight.entity";
import { FightExecutionResult } from "../types/fight/fight.type";
import { TurnExecutionResult } from "../types/turns/turn.types";

@Injectable()
export class FightManager {
    constructor(
        private turnManager: TurnManager
    ) { }

    executeFight(fight: FightEntity): FightExecutionResult {
        if (fight.status === 'pending') {
            fight.start();
        }

        const turns: TurnExecutionResult[] = [];

        while (!fight.isFinished) {
            const turn = this.turnManager.executeNextTurn(fight);
            turns.push(turn);
        }

        const result = fight.result;

        if (!result) {
            throw new Error(`Fight ${fight.id} finished without result.`);
        }

        return {
            fightId: fight.id,
            turns,
            result
        };

    }
}