import { Injectable } from "@nestjs/common";
import { FightDetails } from "../../types/entites/fight-details.type";
import { ActionDefenderType } from "../../types/services/defense-description.type";
import { ActionAttackerType } from "../../types/services/damage-description.type";
import { FighterEffectDescription } from "../../types/entites/fight-entity.type";


@Injectable()
export class DefenderFightDetailsService {

    registerDefenderTurn(
        attackerAction: ActionAttackerType,
        defenderAction: ActionDefenderType,
        defenderEffects: FighterEffectDescription,
        defenderFightDetails: FightDetails,
    ) {
        this.registerDefenderActions(attackerAction,defenderAction,defenderFightDetails)
        this.registerTurnEffects(defenderFightDetails,defenderEffects,defenderAction)
    }


    private registerDefenderActions(
        attackerAction: ActionAttackerType,
        defenderAction: ActionDefenderType,
        defenderFightDetails: FightDetails,
    ) {

        if (defenderAction.type_action === 'def_basic_attack') {
            defenderFightDetails.ataques_bloqueados += defenderAction.defensiveChance.bloquear_ataques ? 1 : 0
            defenderFightDetails.ataques_esquivados += defenderAction.defensiveChance.esquivar_ataques ? 1 : 0
            defenderFightDetails.reflejo_realizado += defenderAction.defensiveChance.reflectar ? 1 : 0
        }

        if (attackerAction.type_action === 'basic_attack') {
            defenderFightDetails.ad_mitigado += attackerAction.dmg - defenderAction.dmgToReceive
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

    private registerTurnEffects(
        defenderFightDetails: FightDetails,
        defenderEffects: FighterEffectDescription,
        defenderAction: ActionDefenderType
    ) {
        defenderFightDetails.turno_anulado += defenderEffects.desmayo.isActive ? 1 : 0
        defenderFightDetails.reflejo_aplicado += defenderAction.reflectar_dmg > 0 ? 1 : 0
        defenderFightDetails.reflejo_realizado += defenderAction.reflectar_dmg
    }

}