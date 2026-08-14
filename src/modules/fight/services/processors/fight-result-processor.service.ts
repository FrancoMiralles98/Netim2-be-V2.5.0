import { Injectable } from "@nestjs/common";
import { FightEntity } from "../../entities/fight.entity";
import { FighterFightSummary, FightProcessedResult } from "./fight-result-processor.types";
import { SideTurnExecutionResult } from "../../types/side/side.types";
import { FightEvent } from "../../types/fightEvents/fight-event.types";

@Injectable()
export class FightResultProcessorService {

    process(
        fight: FightEntity,
        turns: SideTurnExecutionResult[],
        events: FightEvent[]
    ): FightProcessedResult {
        const result = fight.result;

        if (!fight.isFinished) {
            throw new Error(`Fight ${fight.id} must be finished before processing its final result.`);
        }

        if (!result) {
            throw new Error(`Fight ${fight.id} has no result. The fight must be finished before processing.`);
        }

        return {
            result,
            turns,
            fighters: this.processFighters(fight),
            events
        };
    }

    private processFighters(fight: FightEntity): FighterFightSummary[] {

        return fight.getFighters().map(fighter => {
            return {
                fighterId: fighter.id,
                name: fighter.name,
                side: fight.getSideOf(fighter.id),
                alive: fighter.isAlive(),
                resources: {
                    hp: fighter.getCurrentHp(),
                    mana: fighter.getCurrentMana()
                },
                statistics: fighter.statistics.toSnapshot()
            };
        });
    }
}