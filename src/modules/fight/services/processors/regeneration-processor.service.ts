import { Injectable } from "@nestjs/common";
import { TurnContext } from "../../types/fight/fight-context.types";
import { HealingResolverService } from "../resolvers/healing-resolver.service";

@Injectable()
export class RegenerationProcessorService {
    constructor(
        private healingResolver: HealingResolverService
    ) { }

    processTurnStart(context: TurnContext) {
        const regenValues = context.actor.getRegenerationValues()
        const target = context.fight.getSingleOpponentOf(context.actor.id)
        const healingResult = this.healingResolver.resolve({
            baseAmount: regenValues.hp,
            healer: context.actor,
            opponent: target,
            source: 'regeneration'
        })

        const manaResult = context.actor.restoreMana(regenValues.mana)

        context.actor.statistics.registerHealing({
            type: 'regeneration',
            amount: healingResult.effectiveHealing
        })
        context.actor.statistics.registerResources({
            manaRegenerated: manaResult.effectiveRestoration
        })

        target.statistics.registerHealing({
            type: 'prevented',
            amount: healingResult.preventedAmount
        })
    }
}