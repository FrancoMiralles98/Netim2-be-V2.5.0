import { BASIC_MAX_TURNS } from "../const/max-turns.const";
import { FighterType } from "../types/entites/fight-entity.type";
import { FightResult } from "../types/entites/fight-result.type";

/**
 * Entidad principal encargada de gestionar el estado y flujo
 * de una pelea 1vs1.
 */
export class FightEntity {
        private currentAttacker: FighterType;
        private currentDefender: FighterType;

        //si no hay ganador se da empate (ya que ninguno logro vencer a su adversario en los turnos dados)
        private winner?: string

        /** Se utiliza en el cliente para saber poner el que inicio de la pelea en el primer lugar */
        private initialAttacker: string

        private isFinished = false

        //Turno actual de la pelea
        private turns = 0

        private maxTurns: number

        constructor(
                fighterA: FighterType,
                fighterB: FighterType,
                maxTurns: number = BASIC_MAX_TURNS
        ) {
                this.initialAttacker = fighterA.nombre
                this.currentAttacker = fighterA
                this.currentDefender = fighterB
                this.maxTurns = maxTurns
        }

        fightEnds() {
                if (this.turns > this.maxTurns) {
                        return true
                }
                
                return this.isFinished
        }

        //Se utiliza para añadir turnos de peleas secundarias (spawns de enemigos)
        addTurns(turns:number) {
                this.turns += turns
        }

        getWinner() {
                return this.winner
        }

        getCurrentAttacker() {
                return this.currentAttacker
        }

        getCurrentDefender() {
                return this.currentDefender
        }

        getCopyAttacker() {
                return structuredClone(this.currentAttacker)
        }

        getCopyDefender() {
                return structuredClone(this.currentDefender)
        }

        advanceTurn() {
                this.turns++

                this.checkFightFinished()

                if (!this.isFinished) {
                        this.nextTurn()
                }
        }

        getFightResult(): FightResult {
                if (!this.fightEnds()) {
                        throw new Error('Error al obtener el resultado de la pelea: La pelea todavia no termino')
                }
                return {
                        winner: this.getWinner(),
                        initialAttacker: this.initialAttacker,
                        totalTurns: this.turns,
                        fighters: [
                                this.getCopyAttacker(),
                                this.getCopyDefender()
                        ],
                        party: [],
                        spawns: []
                }
        }

        /**
        * Intercambia el atacante y defensor actual
        * para preparar el siguiente turno.
        */
        private nextTurn() {
                [this.currentAttacker, this.currentDefender] = [this.currentDefender, this.currentAttacker]
        }

        private checkFightFinished(): void {
                if (this.currentDefender.stats.general.hp.actual <= 0) {
                        this.isFinished = true
                        this.winner = this.currentAttacker.nombre
                        return
                }

                if (this.currentAttacker.stats.general.hp.actual <= 0) {
                        this.isFinished = true
                        this.winner = this.currentDefender.nombre
                        return
                }

                if (this.turns >= this.maxTurns) {
                        this.isFinished = true
                        this.winner = undefined // empate
                }
        }
}