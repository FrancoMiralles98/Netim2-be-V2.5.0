import { Injectable } from "@nestjs/common";
import { FighterType } from "../types/entites/fight-entity.type";
import { AttackerService } from "./attacker/attacker.service";
import { DefenderService } from "./defender/defender.service";
import { EffectsService } from "./effects/effect.service";
import { FightDetailsService } from "./util/fight-details.service";
import { FightSkillService } from "./attacker/fight-skill.service";

/**
 * Servicio encargado de ejecutar un turno completo de combate.
 *
 * Orquesta:
 * - reducción de cooldowns de habilidades
 * - reducción de duración de efectos activos
 * - acción ofensiva del atacante
 * - respuesta defensiva del defensor
 * - aplicación de efectos al defensor
 * - cálculo de estadísticas del turno
 * - actualización final de HP y detalles de pelea
 */
@Injectable()
export class FightTurnService {

    constructor(
        private attackerService: AttackerService,
        private fightSkillService: FightSkillService,
        private defenderService: DefenderService,
        private effectService: EffectsService,
        private fightDetailsService: FightDetailsService
    ) { }

    /**
     * Ejecuta un turno de combate entre atacante y defensor.
     *
     * Si no es doble golpe:
     * - reduce cooldowns de habilidades del atacante
     * - reduce duración de efectos activos del atacante
     *
     * Luego:
     * - resuelve la acción ofensiva
     * - aplica defensa
     * - calcula efectos
     * - registra detalles de pelea
     * - actualiza HP de ambos peleadores
     *
     * @param attacker Peleador que ejecuta el turno.
     * @param defender Peleador que recibe la acción.
     * @param isDobleGolpe Indica si el turno corresponde a un golpe extra.
     */
    executeTurn(
        attacker: FighterType,
        defender: FighterType,
        isDobleGolpe: boolean
    ) {

        if (!isDobleGolpe) {
            attacker.fight_details.skills_used = this.fightSkillService.reduceCdSkills(attacker)
            attacker.effects = this.effectService.reduceDurationOfEffects(attacker.effects)
        }

        const attackerAction = this.attackerService.executeCombatAction(attacker, defender, isDobleGolpe)

        if (attackerAction.type_action === 'skill') {
            attacker.fight_details.skills_used = this.fightSkillService.updateCdSkill(attacker, attackerAction)
        }

        const defenderAction = this.defenderService.executeDefenseAction(attackerAction, attacker, defender)

        const updatedDefenderEffects = this.effectService.calculateEffectPlayer(attackerAction, attacker, defender)

        const { attackerResult, defenderResult, attackerHealedReceived, defenderDmgReceived } = this.fightDetailsService.getTurnResult(
            attackerAction,
            defenderAction,
            updatedDefenderEffects,
            attacker,
            defender,
            isDobleGolpe
        )

        attacker.effects.doble_golpe = attackerAction.type_action === 'basic_attack'
            ? attackerAction.doble_golpe
            : false

        attacker.fight_details = attackerResult
        defender.fight_details = defenderResult
        attacker.stats.general.hp.actual = Math.min(
            attacker.stats.general.hp.max,
            attacker.stats.general.hp.actual + attackerHealedReceived,
        )
        defender.stats.general.hp.actual -= defenderDmgReceived
    }

}