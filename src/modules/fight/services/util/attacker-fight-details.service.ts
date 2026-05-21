import { Injectable } from "@nestjs/common";
import { ActionAttackerType } from "../../types/services/damage-description.type";
import { ActionDefenderType } from "../../types/services/defense-description.type";
import { FightDetails } from "../../types/entites/fight-details.type";

@Injectable()
export class AttackerFightDetails {

    registerAttackerDmgActions(
        attackerAction: ActionAttackerType,
        defenderAction: ActionDefenderType,
        attackerFightDetails: FightDetails,
    ) {
        if (attackerAction.type_action === 'basic_attack') {
            attackerFightDetails.ad_realizado += defenderAction.dmgToReceive
            attackerFightDetails.ad_ataque_basico += defenderAction.dmgToReceive
            attackerFightDetails.ataque_basico_realizado += attackerAction.doble_golpe ? 2 : 1
            attackerFightDetails.ataques_errados += attackerAction.missHit ? 1 : 0
            attackerFightDetails.penetracion_realizado += attackerAction.effectsChances.penetracion ? 1 : 0
            attackerFightDetails.doble_golpe_realizado += attackerAction.doble_golpe ? 1 : 0
        }

        if (attackerAction.type_action === 'skill') {
            if (attackerAction.type_damage === 'ad') {
                attackerFightDetails.ad_realizado += defenderAction.dmgToReceive
            }
            if (attackerAction.type_damage === 'ap') {
                attackerFightDetails.ap_realizado += defenderAction.dmgToReceive
            }
        }

        attackerFightDetails.critico_realizado += attackerAction.effectsChances.critico ? 1 : 0
    }
}