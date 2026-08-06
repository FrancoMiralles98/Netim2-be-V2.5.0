import { Injectable } from "@nestjs/common";
import { TurnEndResult } from "../../types/turns/turn.types";
import { CombatAction } from "../../types/combatAction/combat-action.types";
import { ActionResolution } from "../../types/actionResolution/action-resolution.types";
import { TurnContext } from "../../types/fight/fight-context.types";
import { AuraManager } from "../../manager/aura-manager";
import { StatusEffectManager } from "../../manager/status-effect-manager";
import { BuffManager } from "../../manager/buff-manager";

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

        const expiredAuras = this.auraManager.advanceTurn(input.context.actor, input.context.turnNumber)

        const expiredBuffs = this.BuffManager.advanceTurn(input.context.actor, input.context.turnNumber)

        const expiredStatusEffects = this.statusEffectManager.advanceTurn(
            input.context.actor, input.context.turnNumber)

        return {
            expiredAuraInstanceIds: expiredAuras.map(aura => aura.getInstanceId()),
            expiredBuffInstanceIds: expiredBuffs.map(buff => buff.getInstanceId()),
            expiredStatusEffectInstanceIds: expiredStatusEffects.map(effect => effect.getInstanceId())
        };
    }
}