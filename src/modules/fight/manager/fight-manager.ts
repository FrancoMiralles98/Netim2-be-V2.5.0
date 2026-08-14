import { Injectable } from "@nestjs/common";
import { FightEntity } from "../entities/fight.entity";
import { SideTurnExecutionResult } from "../types/side/side.types";
import { SideTurnManager } from "./side-turn-manger";
import { FightEvent } from "../types/fightEvents/fight-event.types";
import { FightResultProcessorService } from "../services/processors/fight-result-processor.service";
import { FightProcessedResult } from "../services/processors/fight-result-processor.types";

@Injectable()
export class FightManager {
    constructor(
        private readonly sideTurnManager: SideTurnManager,
        private readonly fightResultProcessorService: FightResultProcessorService,
    ) { }

    executeFight(fight: FightEntity): FightProcessedResult {
        if (fight.status === 'pending') {
            fight.start();
        }

        const turns: SideTurnExecutionResult[] = [];
        const events: FightEvent[] = []

        while (!fight.isFinished) {
            const turn = this.sideTurnManager.executeNextTurn(fight);
            turns.push(turn);

            turn.actions.forEach(action => {
                events.push(...action.events)
            });
        }


        return this.fightResultProcessorService.process(
            fight,
            turns,
            events
        )
    }
}