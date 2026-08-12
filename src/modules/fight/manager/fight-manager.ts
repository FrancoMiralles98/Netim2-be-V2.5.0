import { Injectable } from "@nestjs/common";
import { FightEntity } from "../entities/fight.entity";
import { FightExecutionResult } from "../types/fight/fight.type";
import { SideTurnExecutionResult } from "../types/side/side.types";
import { SideTurnManager } from "./side-turn-manger";

@Injectable()
export class FightManager {
    constructor(private readonly sideTurnManager: SideTurnManager) { }

    executeFight(fight: FightEntity): FightExecutionResult {
        if (fight.status === 'pending') {
            fight.start();
        }

        const turns: SideTurnExecutionResult[] = [];

        while (!fight.isFinished) {
            const turn = this.sideTurnManager.executeNextTurn(fight);
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