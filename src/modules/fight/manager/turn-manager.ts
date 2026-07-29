import { Injectable } from "@nestjs/common";
import { TurnStartProcessorSerivce } from "../services/turn/turn-start-processor.service";
import { FightEntity } from "../entities/fight.entity";
import { TurnContext } from "../types/fight/fight-context.types";
import { CombatAction } from "../types/combatAction/combat-action.types";

@Injectable()
export class TurnManager {
    constructor(
        private turnStartProcessor: TurnStartProcessorSerivce
    ) { }

    executeNextTurn(fight: FightEntity) {
        const { actorId, phase, turnNumber } = fight.beginNextTurn()

        const context: TurnContext = {
            actor: fight.getFighter(actorId),
            turnNumber,
            fight,
            events: []
        }

        context.events.push({
            type: phase,
            turnNumber: context.turnNumber,
            actorId: context.actor.id
        })

        const startTurnResult = this.turnStartProcessor.process(context)
        
        let action: CombatAction | undefined
        let resolution: any |  undefined //(type): CombatResolution

        if (startTurnResult.canAct) {

        }

    }


}