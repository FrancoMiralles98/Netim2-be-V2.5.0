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
import { CombatAction } from "netim2-shared";

@Injectable()
export class FighterTurnManager {
    constructor(
        private turnStartProcessor: TurnStartProcessorSerivce,
        private combatActionSelector: CombatActionSelectorService,
        private actionResolution: ActionResolutionService,
        private turnEndProcessor: TurnEndProcessorService,
    ) { }

    /** Procesa el turno; las auras iniciales consumen la primera acción de su dueño. */
    execute(fight: FightEntity, actor: FighterCombatEntity, turnNumber: number, consumedByInitialAuras = false): FighterTurnExecutionResult {

        const context: TurnContext = {
            actor: fight.getFighter(actor.id),
            turnNumber,
            fight,
            events: []
        }

        context.events.push({
            type: 'turn_started',
            actorId: context.actor.id,
        })

        const startTurnResult = this.turnStartProcessor.process(context)

        const action: CombatAction = consumedByInitialAuras
            ? { type: 'skip_turn', reason: 'no_available_action' }
            : this.combatActionSelector.select(context, startTurnResult.canAct);

        if (consumedByInitialAuras) {
            context.events.push({ type: 'action_selected', action });
        }

        const resolution = this.actionResolution.resolve(action, context, startTurnResult.canAct)

        actor.statistics.registerTurnPlayed()

        if (!consumedByInitialAuras && resolution.type === 'skip_turn' && resolution.reason === 'no_available_action') {
            console.log('action',action);
            
            actor.statistics.registerSkippedTurnByStun()
        }

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
