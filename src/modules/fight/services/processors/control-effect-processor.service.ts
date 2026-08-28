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
    ) { }

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

            const processedEffect = this.processControlEffect(context.actor, effect)

            if (processedEffect.preventedAction && !processedEffect.expired) {
                result.canAct = false;
                context.actor.statistics.registerSkippedTurnByStun()

                context.events.push({
                    type: 'control_effect_processed',
                    controlType: 'stun',
                    effectId: effect.getEffectId(),
                    effectInstanceId: effect.getInstanceId(),
                    eventId: randomUUID(),
                    expired: false,
                    fighterId: context.actor.id,
                    fightId: context.fight.id,
                    preventedAction: processedEffect.preventedAction,
                    turnNumber: context.turnNumber,
                    remainingTurns: processedEffect.remainingTurns ?? 0
                })
            }
        }

        return result
    }

    private processControlEffect(
        actor: FighterCombatEntity,
        effect: ActiveStatusEffectEntity,
    ): ProcessedControlEffect {

        effect.consumeTurn()

        const expired = effect.isExpired();

        const remainingTurns = effect.getRemainingTurns();

        if (expired) {
            this.statusEffectManager.deactivate(actor, effect)
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