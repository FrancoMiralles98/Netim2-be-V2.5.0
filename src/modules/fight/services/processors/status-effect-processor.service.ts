import { Injectable } from "@nestjs/common";
import { TurnContext } from "../../types/fight/fight-context.types";
import { isPeriodicDamageEffectData } from "./status-effect-processor.types";

@Injectable()
export class StatusEffectProcessorService {
    process(context: TurnContext) {
        const actorStatusEffects = context.actor.getActiveStatusEffects()

        for (const statusEffect of actorStatusEffects) {
            if (!statusEffect.isActive()) continue;

            if (statusEffect.getTargetFighterId() !== context.actor.id) continue;

            const data = statusEffect.Effectdata

            if (!isPeriodicDamageEffectData(data)) continue
             /**
              * Aca iria el calculo del daño del efecto y su registro, reduccion de duracion
              */
        }
    }
}