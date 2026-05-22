import { Injectable } from "@nestjs/common";
import { FighterType } from "../../types/entites/fight-entity.type";
import { ActionAttackerType } from "../../types/services/damage-description.type";
import { ActionDefenderType } from "../../types/services/defense-description.type";
import { FightDetails } from "../../types/entites/fight-details.type";
import { DEFAULT_FIGHT_DETAILS } from "../../const/entity/fight-details.const";

@Injectable()
export class FightDetailsService {
    getTurnResult(
        attackerAction: ActionAttackerType,
        defenderAction: ActionDefenderType,
        attacker: FighterType,
        defender: FighterType
    ): { attackerResult: FightDetails, defenderResult: FightDetails } {

        const attackerFightDetails = structuredClone(DEFAULT_FIGHT_DETAILS)
        const defenderFightDetails = structuredClone(DEFAULT_FIGHT_DETAILS)

    }
}