import { Injectable } from "@nestjs/common";
import { FighterEffectDescription, FighterType } from "../../types/entites/fight-entity.type";
import { ActionAttackerType } from "../../types/services/damage-description.type";
import { ActionDefenderType } from "../../types/services/defense-description.type";
import { FightDetails } from "../../types/entites/fight-details.type";
import { DEFAULT_FIGHT_DETAILS } from "../../const/entity/fight-details.const";
import { AttackerFightDetailsService } from "./attacker-fight-details.service";
import { DefenderFightDetailsService } from "./defender-fight-details.service";
import { HpService } from "./hp.service";

/**
 * Servicio encargado de construir el resultado estadístico
 * de un turno de combate.
 *
 * Orquesta:
 * - registro ofensivo del atacante
 * - registro defensivo del defensor
 * - cálculo de curación realizada
 * - cálculo de daño recibido
 */
@Injectable()
export class FightDetailsService {

    constructor(
        private attackerFightDetails: AttackerFightDetailsService,
        private defenderFightDetails: DefenderFightDetailsService,
        private hpService: HpService
    ) { }

     /**
     * Calcula el resultado completo de un turno.
     *
     * Genera nuevos detalles de pelea para atacante y defensor,
     * registra sus acciones y calcula los cambios finales de HP.
     *
     * @param attackerAction Acción realizada por el atacante.
     * @param defenderAction Respuesta defensiva del defensor.
     * @param defenderEffect Efectos actualizados del defensor.
     * @param attacker Peleador atacante.
     * @param isDobleGolpe Indica si el turno corresponde a un golpe extra.
     * @returns Resultado estadístico y cambios de HP del turno.
     */
    getTurnResult(
        attackerAction: ActionAttackerType,
        defenderAction: ActionDefenderType,
        defenderEffect: FighterEffectDescription,
        attacker: FighterType,
        defender: FighterType,
        isDobleGolpe: boolean
    ): { attackerResult: FightDetails, defenderResult: FightDetails, attackerHealedReceived: number, defenderDmgReceived: number } {

        const attackerFightDetails = structuredClone(attacker.fight_details)
        const defenderFightDetails = structuredClone(defender.fight_details)

        this.attackerFightDetails.registerAttackerTurn(
            attackerAction,
            defenderAction,
            defenderEffect,
            attacker.effects,
            attackerFightDetails,
            isDobleGolpe
        )

        this.defenderFightDetails.registerDefenderTurn(
            attackerAction, 
            defenderAction, 
            defenderFightDetails
        )

        const { attackerHealing, defenderCortaCura } = this.hpService.getHealingResult(
            attacker, 
            attackerAction, 
            defenderAction
        
        )

        attackerFightDetails.vida_curada += attackerHealing
        defenderFightDetails.curacion_cortada += defenderCortaCura


        const attackerHealedReceived = this.hpService.calculateAttackerHealedReceived(attackerHealing, defenderAction)

        const defenderDmgReceived = this.hpService.calculateDefenderDamageReceived(
            defenderAction.dmgToReceive,
             defenderEffect,
             isDobleGolpe
            )

        return {
            attackerResult: attackerFightDetails,
            defenderResult: defenderFightDetails,
            attackerHealedReceived,
            defenderDmgReceived
        }

    }
}