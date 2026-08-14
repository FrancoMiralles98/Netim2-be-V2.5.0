import { Injectable } from "@nestjs/common";
import { FighterTurnManager } from "./fighter-turn-manager";
import { FightEntity } from "../entities/fight.entity";
import { FighterTurnExecutionResult } from "../types/turns/turn.types";
import { SideTurnExecutionResult } from "../types/side/side.types";

@Injectable()
export class SideTurnManager {

    constructor(
        private readonly figherTurnManager: FighterTurnManager
    ) { }

    executeNextTurn(fight: FightEntity): SideTurnExecutionResult {
        const { side, turnNumber } = fight.beginNextTurn()

        const fighters = fight.getFightersOfSide(side)

        const actions: FighterTurnExecutionResult[] = []

        for (const fighter of fighters) {
            if (fight.isFinished) {
                break
            }

            /*
             * Podría haber muerto durante
             * una acción anterior del mismo
             * turno.
             */
            if (!fighter.isAlive) {
                continue
            }

            const result = this.figherTurnManager.execute(fight, fighter, turnNumber)

            actions.push(result)

            /*
             * Por ejemplo:
             *
             * Ally A mata al último enemy.
             *
             * Ally B ya no debe actuar.
             */
            const fightResult = fight.tryFinish();

            if (fightResult) {
                return {
                    turnNumber,
                    side,
                    actions,
                    fightFinished: true,
                    fightResult
                };
            }
        }

        fight.completeCurrentTurn();

        return {
            turnNumber,
            side,
            actions,
            fightFinished: fight.isFinished,
            fightResult: fight.result
        }
    }
}