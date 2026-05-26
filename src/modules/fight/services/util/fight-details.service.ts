import { Injectable } from "@nestjs/common";
import { FighterEffectDescription, FighterType } from "../../types/entites/fight-entity.type";
import { ActionAttackerType } from "../../types/services/damage-description.type";
import { ActionDefenderType } from "../../types/services/defense-description.type";
import { FightDetails } from "../../types/entites/fight-details.type";
import { DEFAULT_FIGHT_DETAILS } from "../../const/entity/fight-details.const";
import { AttackerFightDetailsService } from "./attacker-fight-details.service";
import { DefenderFightDetailsService } from "./defender-fight-details.service";
import { HpService } from "./hp.service";

@Injectable()
export class FightDetailsService {

    constructor(
        private attackerFightDetails: AttackerFightDetailsService,
        private defenderFightDetails: DefenderFightDetailsService,
        private hpService: HpService
    ) { }

    getTurnResult(
        attackerAction: ActionAttackerType,
        defenderAction: ActionDefenderType,
        defenderEffect: FighterEffectDescription,
        attacker: FighterType,
    ): { attackerResult: FightDetails, defenderResult: FightDetails, attackerHealedReceived: number, defenderDmgReceived: number } {

        const attackerFightDetails = structuredClone(DEFAULT_FIGHT_DETAILS)
        const defenderFightDetails = structuredClone(DEFAULT_FIGHT_DETAILS)

        this.attackerFightDetails.registerAttackerTurn(attackerAction, defenderAction, defenderEffect, attackerFightDetails)
        this.defenderFightDetails.registerDefenderTurn(attackerAction, defenderAction, defenderEffect, defenderFightDetails)

        const { attackerHealing, defenderCortaCura } = this.hpService.getHealingResult(attacker, attackerAction, defenderAction)

        attackerFightDetails.vida_curada += attackerHealing
        defenderFightDetails.curacion_cortada += defenderCortaCura


        const attackerHealedReceived = this.hpService.calculateAttackerHealedReceived(attackerHealing, defenderAction)

        const defenderDmgReceived = this.hpService.calculateDefenderDamageReceived(defenderAction.dmgToReceive, defenderEffect)

        return {
            attackerResult: attackerFightDetails,
            defenderResult: defenderFightDetails,
            attackerHealedReceived,
            defenderDmgReceived
        }

    }
}