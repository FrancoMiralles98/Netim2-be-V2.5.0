import { Injectable } from "@nestjs/common";
import { ActionAttackerType } from "../../types/services/damage-description.type";
import { ActionDefenderType } from "../../types/services/defense-description.type";
import { FightDetails } from "../../types/entites/fight-details.type";
import { FighterEffectDescription } from "../../types/entites/fight-entity.type";
import { DamageEffectKeys } from "../../types/config/effect-key.types";

@Injectable()
export class AttackerFightDetailsService {

    registerAttackerActions(
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

    registerTurnEffects(
        attackerFightDetails: FightDetails,
        defenderEffects: FighterEffectDescription
    ) {
        attackerFightDetails.incendio_aplicado += defenderEffects.incendio.isActive ? 1 : 0
        attackerFightDetails.veneno_aplicado += defenderEffects.veneno.isActive ? 1 : 0
        attackerFightDetails.sangrado_aplicado += defenderEffects.sangrado.isActive ? 1 : 0

        attackerFightDetails.incendio_realizado +=
            defenderEffects.incendio.isActive ?  defenderEffects.incendio.dmgOfEffect : 0
        attackerFightDetails.veneno_realizado +=
            defenderEffects.veneno.isActive ? defenderEffects.veneno.dmgOfEffect : 0
        attackerFightDetails.sangrado_realizado +=
            defenderEffects.sangrado.isActive ? defenderEffects.sangrado.dmgOfEffect : 0
        
        attackerFightDetails.retardo_aplicado += defenderEffects.retardo.isActive ? 1 : 0
    }
}