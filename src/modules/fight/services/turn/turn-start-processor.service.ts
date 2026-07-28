import { Injectable } from "@nestjs/common";
import { TurnContext } from "../../types/fight/fight-context.types";
import { CooldownProcessorService } from "../processors/cooldown.processor.service";
import { RegenerationProcessorService } from "../processors/regeneration-processor.service";
import { AuraUnkeepProcessorService } from "../processors/aura-unkeep-processor.service";
import { StatusEffectProcessorService } from "../processors/status-effect-processor.service";

@Injectable()
export class TurnStartProcessorSerivce {
    constructor(
        private cooldownProcessorService: CooldownProcessorService,
        private regenerationProcessorService: RegenerationProcessorService,
        private auraUnkeepProcessorService: AuraUnkeepProcessorService,
        private statusEffectProcessor: StatusEffectProcessorService,
    ){}

    process(context: TurnContext) {
       this.cooldownProcessorService.processTurnStart(context)
       this.regenerationProcessorService.processTurnStart(context)
       this.auraUnkeepProcessorService.process(context.actor,context)
       this.statusEffectProcessor.process(context) //falta resolver daños y duracion
        /**
         * falta los status de CC (desmayo y retardo)
         * y verificar si sigue vivo y si puede realizar acciones
         */
    }
}