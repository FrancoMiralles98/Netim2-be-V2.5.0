import { BASIC_MAX_TURNS } from "../const/max-turns.const";
import { FightDetails } from "../types/entites/fight-details.type";
import { FighterType } from "../types/entites/fight-entity.type";

export class FightEntity {
        private currentAttacker: FighterType;
        private currentDefender: FighterType;

        private winner?: string
        private isFinished = false
        private turns = 0
        private maxTurns: number

        constructor(
                fighterA: FighterType,
                fighterB: FighterType,
                maxTurns: number = BASIC_MAX_TURNS
        ) {
                this.currentAttacker = fighterA
                this.currentDefender = fighterB
                this.maxTurns = maxTurns
        }

        fightEnds() {
                return this.isFinished
        }

        getWinner() {
                return this.winner
        }

        getCurrentAttacker() {
                return structuredClone(this.currentAttacker)
        }

        getCurrentDefender() {
                return structuredClone(this.currentDefender)
        }

        applyTurnResult(result: FightDetails) {

        }

        private nextTurn() {
                [this.currentAttacker, this.currentDefender] = [this.currentDefender, this.currentAttacker]
        }
}