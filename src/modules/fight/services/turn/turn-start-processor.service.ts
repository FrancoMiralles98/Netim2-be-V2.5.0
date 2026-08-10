import { Injectable } from "@nestjs/common";
import { TurnContext } from "../../types/fight/fight-context.types";
import { CooldownProcessorService } from "../processors/cooldown.processor.service";
import { RegenerationProcessorService } from "../processors/regeneration-processor.service";
import { AuraUnkeepProcessorService } from "../processors/aura-unkeep-processor.service";
import { StatusEffectProcessorService } from "../processors/status-effect-processor.service";
import { ControlEffectProcessorService } from "../processors/control-effect-processor.service";

@Injectable()
export class TurnStartProcessorSerivce {
    constructor(
        private cooldownProcessorService: CooldownProcessorService,
        private regenerationProcessorService: RegenerationProcessorService,
        private auraUnkeepProcessorService: AuraUnkeepProcessorService,
        private statusEffectProcessor: StatusEffectProcessorService,
        private controlEffectProcessor: ControlEffectProcessorService,
    ) { }

    process(context: TurnContext): { canAct: boolean } {
        
        this.cooldownProcessorService.processTurnStart(context)

        this.regenerationProcessorService.processTurnStart(context)

        this.auraUnkeepProcessorService.process(context.actor, context)

        const periodicEffects = this.statusEffectProcessor.process(context)
        if (periodicEffects.actorDefeated) {
            return {
                canAct: false
            }
        }

        const controlResult = this.controlEffectProcessor.process(context)
        if (!controlResult.canAct) {
            return {
                canAct: false
            }
        }
        return { canAct: true }
    }
}