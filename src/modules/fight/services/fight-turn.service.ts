import { Injectable } from "@nestjs/common";
import { FighterType } from "../types/entites/fight-entity.type";
import { FightDetails } from "../types/entites/fight-details.type";
import { AttackerService } from "./attacker/attacker.service";
import { DefenderService } from "./defender/defender.service";
import { EffectsService } from "./effects/effect.service";

@Injectable()
export class FightTurnService {

    constructor(
        private attackerService: AttackerService,
        private defenderServivice: DefenderService,
        private effectService: EffectsService,
    ) {}

    executeTurn(
        attacker: FighterType,
        defender: FighterType
    ): FightDetails {

        const attackerAction = this.attackerService.executeCombatAction(attacker,defender)
        const defenderAction = this.defenderServivice.executeDefenseAction(attackerAction,attacker,defender)
        

        const updatedDefenderEffects = this.effectService.calculateEffectPlayer(attackerAction,attacker,defender)

    }


}