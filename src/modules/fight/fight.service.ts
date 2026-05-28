import { Injectable } from '@nestjs/common';
import { MobType } from '../mob/types/mobProps/mob.type';
import { CharacterPersistence } from '../character/types/character-persistence.type';
import { FightFactory } from './factory/fight-factory';
import { FightTurnService } from './services/fight-turn.service';
import { FightResult } from './types/entites/fight-result.type';
import { FighterType } from './types/entites/fight-entity.type';

/**
 * Servicio principal encargado de ejecutar peleas.
 */
@Injectable()
export class FightService {

    constructor(
        private fightFactory: FightFactory,
        private fightTurnService: FightTurnService
    ) { }

    /**
    * Ejecuta una pelea donde el objetivo principal puede invocar mobs auxiliares.
    *
    * Flujo:
    * - El personaje combate primero contra cada mob spawneado.
    * - Si pierde o no logra derrotar a un spawn, la pelea finaliza.
    * - Si derrota todos los spawns, pelea contra el spawner principal.
    *
    * Reglas:
    * - Cada pelea contra spawn mantiene el HP y estado acumulado
    *   del personaje para la siguiente pelea.
    *
    * @param character Personaje que inicia la pelea.
    * @param spawner Mob principal que puede generar spawn.
    *
    * @returns Resultado completo de la pelea:
    */
    executeFightWithSpawns(
        character: CharacterPersistence,
        spawner: MobType,
    ): FightResult {

        const spawns = spawner.spawnConfig?.mobsSpawned ?? []

        const spawnsResult: FighterType[] = spawns.map(spawn =>
            this.fightFactory.asignFighters(spawn)
        )

        let currentCharacter: FighterType = this.fightFactory.asignFighters(character)
        let totalTurns = 0

        for (let index = 0; index < spawns.length; index++) {
            const spawn = spawns[index]

            const spawnFightResult = this.executeFight1v1(currentCharacter, spawn)

            totalTurns += spawnFightResult.totalTurns

            const characterResult = spawnFightResult.fighters.find(
                fighter => fighter.nombre === character.nombre,
            )

            const spawnResult = spawnFightResult.fighters.find(
                fighter => fighter.nombre === spawn.nombre,
            )

            if (!characterResult || !spawnResult) {
                throw new Error('No se pudo obtener el resultado de la pelea contra el spawn')
            }

            currentCharacter = characterResult
            spawnsResult[index] = spawnResult

            if (!spawnFightResult.winner || spawnFightResult.winner === spawnResult.nombre) {
                return {
                    initialAttacker: character.nombre,
                    winner: spawnFightResult.winner,
                    totalTurns,
                    fighters: [
                        characterResult,
                        this.fightFactory.asignFighters(spawner),
                    ],
                    party: [],
                    spawns: spawnsResult,
                }
            }
        }

        const finalFightResult = this.executeFight1v1(
            currentCharacter,
            spawner,
        )

        totalTurns += finalFightResult.totalTurns

        return {
            initialAttacker: character.nombre,
            winner: finalFightResult.winner,
            totalTurns,
            fighters: finalFightResult.fighters,
            party: [],
            spawns: spawnsResult,
        }
    }

    /**
     * Ejecuta una pelea 1vs1 completa entre dos participantes.
     *
     * Flujo:
     * - Crea la entidad de pelea.
     * - Ejecuta turnos hasta que la pelea finalice.
     * - Procesa golpes extra si corresponde.
     * - Avanza el estado de la pelea.
     *
     * @param fighterA Primer participante de la pelea.
     * @param fighterB Segundo participante de la pelea.
     * @returns Resultado final del combate.
     */
    executeFight1v1(
        fighterA: FighterType | MobType | CharacterPersistence,
        fighterB: FighterType | MobType | CharacterPersistence,
    ): FightResult {
        const fight = this.fightFactory.createFight(fighterA, fighterB)

        while (!fight.fightEnds()) {
            const attacker = fight.getCurrentAttacker()
            const defender = fight.getCurrentDefender()

            this.fightTurnService.executeTurn(attacker, defender, false)
            this.executeExtraHitIfNeeded(attacker, defender)

            fight.advanceTurn()
        }

        return fight.getFightResult()
    }

    /**
     * Ejecuta un golpe extra si el atacante activó doble golpe.
     *
     * Luego de ejecutar el golpe extra,
     * el estado de doble golpe es reiniciado.
     *
     * @param attacker Peleador atacante.
     * @param defender Peleador defensor.
     */
    private executeExtraHitIfNeeded(attacker: FighterType, defender: FighterType): void {
        if (!attacker.effects.doble_golpe) {
            return
        }

        if (attacker.stats.general.hp.actual <= 0 || defender.stats.general.hp.actual <= 0) {
            attacker.effects.doble_golpe = false
            return
        }

        this.fightTurnService.executeTurn(attacker, defender, true)
        attacker.effects.doble_golpe = false
    }
}
