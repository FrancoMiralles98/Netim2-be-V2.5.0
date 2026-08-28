import { Injectable } from "@nestjs/common";
import { TurnEndResult } from "../../types/turns/turn.types";
import { ActionResolution } from "../../types/actionResolution/action-resolution.types";
import { TurnContext } from "../../types/fight/fight-context.types";
import { AuraManager } from "../../manager/aura-manager";
import { StatusEffectManager } from "../../manager/status-effect-manager";
import { BuffManager } from "../../manager/buff-manager";
import { ActiveDurationAdvanceResult, CombatAction } from "netim2-shared";
import { ActiveAuraEntity } from "../../entities/active-aura.entity";
import { ProcessAuraDuration } from "../../types/auraManager/auraManager.types";
import { ActiveBuffEntity } from "../../entities/active-buff.entity";
import { ActiveStatusEffectEntity } from "../../entities/active-status-effect.entity";
import { randomUUID } from "crypto";

@Injectable()
export class TurnEndProcessorService {
    constructor(
        private auraManager: AuraManager,
        private statusEffectManager: StatusEffectManager,
        private BuffManager: BuffManager,
    ) { }

    process(input: {
        context: TurnContext;
        startTurnResult: { canAct: boolean };
        action: CombatAction;
        resolution: ActionResolution;
    }): TurnEndResult {

        const updatedAuras = this.auraManager.advanceTurn(input.context.actor, input.context.turnNumber)

        const updatedBuffs = this.BuffManager.advanceTurn(input.context.actor, input.context.turnNumber)

        const updatedStatusEffects = this.statusEffectManager.advanceTurn(
            input.context.actor, input.context.turnNumber)

        this.processEvents(updatedAuras, updatedBuffs, updatedStatusEffects, input.context)

        return {
            expiredAuraInstanceIds: updatedAuras.filter(aura => !aura.isActive()).map(aura => aura.getInstanceId()),
            expiredBuffInstanceIds: updatedBuffs.filter(buff => !buff.isActive()).map(buff => buff.getInstanceId()),
            expiredStatusEffectInstanceIds: updatedStatusEffects.filter(effect => !effect.isActive()).map(effect => effect.getInstanceId())
        };
    }

    private processEvents(
        auras: ActiveAuraEntity[],
        buffs: ActiveBuffEntity[],
        effects: ActiveStatusEffectEntity[],
        context: TurnContext
    ) {
        for (const aura of auras) {
            context.events.push({
                type: 'aura_duration_updated',
                auraInstanceId: aura.getInstanceId(),
                eventId: randomUUID(),
                fighterId: context.actor.id,
                fightId: context.fight.id,
                previousRemainingTurns: aura.getDuration.getRemainingTurns() ?? 0,
                remainingTurns: aura.getDuration.getRemainingTurns() ?? 0,
                skillId: aura.getSkillId(),
                turnNumber: context.turnNumber
            })
        }

        for (const effect of effects) {
            context.events.push({
                type: 'status_effect_duration_updated',
                effectInstanceId: effect.getInstanceId(),
                eventId: randomUUID(),
                targetFighterId: context.actor.id,
                fightId: context.fight.id,
                previousRemainingTurns: effect.getRemainingTurns() ?? 0,
                remainingTurns: effect.getRemainingTurns() ?? 0,
                effectId: effect.getEffectId(),
                turnNumber: context.turnNumber
            })
        }

        for (const buff of buffs) {
            context.events.push({
                type: 'buff_duration_updated',
                buffInstanceId: buff.getInstanceId(),
                eventId: randomUUID(),
                fighterId: context.actor.id,
                fightId: context.fight.id,
                previousRemainingTurns: buff.getRemainingTurns() ?? 0,
                remainingTurns: buff.getRemainingTurns() ?? 0,
                skillId: buff.getSkillId(),
                turnNumber: context.turnNumber
            })
        }
    }


}