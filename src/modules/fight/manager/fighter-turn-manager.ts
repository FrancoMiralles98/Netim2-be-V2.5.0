import { Injectable } from "@nestjs/common";
import { TurnStartProcessorSerivce } from "../services/turn/turn-start-processor.service";
import { FightEntity } from "../entities/fight.entity";
import { TurnContext } from "../types/fight/fight-context.types";
import { CombatActionSelectorService } from "../services/action/combat-action-selector.service";
import { ActionResolutionService } from "../services/action/action-resolution.service";
import { FighterTurnExecutionResult } from "../types/turns/turn.types";
import { TurnEndProcessorService } from "../services/turn/turn-end-processor.service";
import { randomUUID } from "crypto";
import { FighterCombatEntity } from "../entities/fighter-combat.entity";

@Injectable()
export class FighterTurnManager {
    constructor(
        private turnStartProcessor: TurnStartProcessorSerivce,
        private combatActionSelector: CombatActionSelectorService,
        private actionResolution: ActionResolutionService,
        private turnEndProcessor: TurnEndProcessorService,
    ) { }

    execute(fight: FightEntity, actor: FighterCombatEntity, turnNumber: number): FighterTurnExecutionResult {

        const context: TurnContext = {
            actor: fight.getFighter(actor.id),
            turnNumber,
            fight,
            events: []
        }

        context.events.push({
            type: 'turn_started',
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

        context.events.push({
            type: 'turn_ended',
            actorAlive: actor.isAlive(),
            actorCurrentHp: actor.getCurrentHp(),
            actorCurrentMana: actor.getCurrentMana(),
            actorId: actor.id,
            eventId: randomUUID(),
            fightId: fight.id,
            turnNumber
        })

        return {
            action,
            actorId: context.actor.id,
            side: fight.getSideOf(actor.id),
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