import { Injectable } from "@nestjs/common";
import { TurnStartProcessorSerivce } from "../services/turn/turn-start-processor.service";
import { FightEntity } from "../entities/fight.entity";
import { TurnContext } from "../types/fight/fight-context.types";
import { CombatActionSelectorService } from "../services/action/combat-action-selector.service";
import { ActionResolutionService } from "../services/action/action-resolution.service";
import { TurnExecutionResult } from "../types/turns/turn.types";
import { TurnEndProcessorService } from "../services/turn/turn-end-processor.service";
import { randomUUID } from "crypto";

@Injectable()
export class TurnManager {
    constructor(
        private turnStartProcessor: TurnStartProcessorSerivce,
        private combatActionSelector: CombatActionSelectorService,
        private actionResolution: ActionResolutionService,
        private turnEndProcessor: TurnEndProcessorService,
    ) { }

    executeNextTurn(fight: FightEntity): TurnExecutionResult {
        const { actorId, phase, turnNumber } = fight.beginNextTurn()

        const context: TurnContext = {
            actor: fight.getFighter(actorId),
            turnNumber,
            fight,
            events: []
        }

        //tipo de evento agragado: Inicio del Turno"
        context.events.push({
            type: phase,
            actorId: context.actor.id,
            eventId: randomUUID(),
            fightId: context.fight.id,
            turnNumber: context.turnNumber
        })

        const startTurnResult = this.turnStartProcessor.process(context)

        const action = this.combatActionSelector.select(context, startTurnResult.canAct)
        const resolution = this.actionResolution.resolve(action, context, startTurnResult.canAct)

        /**
         * evento de action_resolved
         */

        const TurnEndResult = this.turnEndProcessor.process({
            action,
            context,
            resolution,
            startTurnResult
        })

        fight.completeCurrentTurn()

        return {
            action,
            actorId: context.actor.id,
            turnNumber: context.turnNumber,
            resolution,
            startTurnResult,
            endTurnResult: TurnEndResult,
            events: [...context.events],
            fightFinished: context.fight.isFinished,
            fightResult: context.fight.result,
        }
    }
}