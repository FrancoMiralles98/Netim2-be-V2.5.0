import { Injectable } from "@nestjs/common";
import { TurnContext } from "../../types/fight/fight-context.types";
import { ControlEffectProcessorResult, ProcessedControlEffect } from "./control-effect-process.types";
import { ControlEffect, isControlDamageEffectData } from "./status-effect-processor.types";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";
import { ActiveStatusEffectEntity } from "../../entities/active-status-effect.entity";
import { randomUUID } from "crypto";
import { StatusEffectManager } from "../../manager/status-effect-manager";

@Injectable()
export class ControlEffectProcessorService {

    constructor(
        private statusEffectManager: StatusEffectManager
    ){}

    process(context: TurnContext): ControlEffectProcessorResult {
        const result: ControlEffectProcessorResult = {
            canAct: true,
            processedEffects: []
        }

        const activeEffects = [...context.actor.getActiveStatusEffects()]

        for (const effect of activeEffects) {
            if (!effect.isActive()) continue
            if (effect.getTargetFighterId() !== context.actor.id) continue

            const data = effect.Effectdata

            if (!isControlDamageEffectData(data)) continue

            const processedEffect = this.processControlEffect(context.actor, effect, data, context)

            if (processedEffect.preventedAction) {
                result.canAct = false;
                context.actor.statistics.registerSkippedTurnByStun()
            }
        }

        return result
    }

    private processControlEffect(
        actor: FighterCombatEntity,
        effect: ActiveStatusEffectEntity,
        data: ControlEffect,
        context: TurnContext,
    ): ProcessedControlEffect {

        effect.consumeTurn()

        const expired = effect.isExpired();

        const remainingTurns = effect.getRemainingTurns();

        context.events.push({
            type: 'control_effect_processed',
            turnNumber: context.turnNumber,
            fighterId: actor.id,
            effectInstanceId: effect.getInstanceId(),
            effectId: effect.getEffectId(),
            controlType: "stun",
            expired,
            eventId: randomUUID(),
            fightId: context.fight.id,
            preventedAction: !effect.isExpired(),
            remainingTurns,
        })

        if (expired) {
            this.statusEffectManager.deactivate(actor,effect)
        }

        return {
            effectInstanceId: effect.getInstanceId(),
            effectId: effect.getEffectId(),
            preventedAction: !effect.isExpired(),
            remainingTurns,
            expired
        };
    }
}