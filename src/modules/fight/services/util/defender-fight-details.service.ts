import { Injectable } from "@nestjs/common";
import { FightDetails } from "../../types/entites/fight-details.type";
import { ActionDefenderType } from "../../types/services/defense-description.type";
import { ActionAttackerType } from "../../types/services/damage-description.type";

/**
 * Servicio encargado de registrar las estadísticas defensivas
 * generadas por un peleador durante un turno de combate.
 *
 * Responsabilidades:
 * - Registrar bloqueos.
 * - Registrar esquivas.
 * - Registrar daño reflejado.
 * - Registrar daño mitigado.
 */
@Injectable()
export class DefenderFightDetailsService {

    /**
    * Registra toda la actividad defensiva realizada durante un turno.
    *
    * @param attackerAction Acción ejecutada por el atacante.
    * @param defenderAction Respuesta defensiva del defensor.
    * @param defenderFightDetails Estadísticas acumuladas del defensor.
    */
    registerDefenderTurn(
        attackerAction: ActionAttackerType,
        defenderAction: ActionDefenderType,
        defenderFightDetails: FightDetails,
    ) {
        this.registerDefenderActions(attackerAction, defenderAction, defenderFightDetails)
        this.registerTurnEffects(defenderFightDetails, defenderAction)
    }


    /**
     * Registra estadísticas defensivas según la acción recibida.
     *
     * No registra mitigación cuando el ataque básico falla,
     * ya que el daño no fue evitado por el defensor.
     *
     * @param attackerAction Acción ejecutada por el atacante.
     * @param defenderAction Respuesta defensiva del defensor.
     * @param defenderFightDetails Estadísticas acumuladas del defensor.
     */
    private registerDefenderActions(
        attackerAction: ActionAttackerType,
        defenderAction: ActionDefenderType,
        defenderFightDetails: FightDetails,
    ) {

        if (defenderAction.type_action === 'def_basic_attack') {
            defenderFightDetails.ataques_bloqueados += defenderAction.defensiveChance.bloquear_ataques ? 1 : 0
            defenderFightDetails.ataques_esquivados += defenderAction.defensiveChance.esquivar_ataques ? 1 : 0
            defenderFightDetails.reflejo_aplicado += defenderAction.defensiveChance.reflectar ? 1 : 0
        }

        if (attackerAction.type_action === 'basic_attack') {
            if (!attackerAction.missHit) {
                defenderFightDetails.ad_mitigado += attackerAction.dmg - defenderAction.dmgToReceive
            }
        }

        if (attackerAction.type_action === 'skill') {
            if (attackerAction.type_damage === 'ad') {
                defenderFightDetails.ad_mitigado += attackerAction.dmg - defenderAction.dmgToReceive
            }
            if (attackerAction.type_damage === 'ap') {
                defenderFightDetails.ap_mitigado += attackerAction.dmg - defenderAction.dmgToReceive
            }
        }
    }

      /**
     * Registra estadísticas defensivas relacionadas con efectos
     * resultantes de la acción defensiva.
     *
     * Actualmente registra el daño reflejado realizado.
     *
     * @param defenderFightDetails Estadísticas acumuladas del defensor.
     * @param defenderAction Respuesta defensiva del defensor.
     */
    private registerTurnEffects(
        defenderFightDetails: FightDetails,
        defenderAction: ActionDefenderType
    ) {
        defenderFightDetails.reflejo_realizado += defenderAction.reflectar_dmg
    }

}