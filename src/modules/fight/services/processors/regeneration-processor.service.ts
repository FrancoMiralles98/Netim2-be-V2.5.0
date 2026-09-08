import { Injectable } from "@nestjs/common";
import { TurnContext } from "../../types/fight/fight-context.types";
import { HealingResolverService } from "../resolvers/healing-resolver.service";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";
import { FightEntity } from "../../entities/fight.entity";
import { HealingResolution } from "../resolvers/healing-resolver.types";
import { RestoreManaResult } from "../../types/fighter/fighter-combat.types";
import { randomUUID } from "crypto";

@Injectable()
export class RegenerationProcessorService {
    constructor(
        private healingResolver: HealingResolverService
    ) { }

    processTurnStart(context: TurnContext) {
        const regenValues = context.actor.getRegenerationValues()
        const healingResult = this.healingResolver.resolve({
            baseAmount: regenValues.hp,
            healer: context.actor,
            source: 'regeneration'
        })

        if (healingResult.effectiveHealing > 0) {
            context.events.push({
                type: 'resource_changed',
                resource: 'hp',
                previousValue: healingResult.hpBefore,
                currentValue: healingResult.hpAfter,
                amount: healingResult.effectiveHealing,
            })
        }

        const manaResult = context.actor.restoreMana(regenValues.mana)

        if (manaResult.effectiveRestoration > 0) {
            context.events.push({
                type: 'resource_changed',
                resource: 'mana',
                previousValue: manaResult.manaBefore,
                currentValue: manaResult.manaAfter,
                amount: manaResult.effectiveRestoration,
            })
        }


        this.regenerationStatisticRegister(context.actor, context.fight, healingResult, manaResult)
    }


    private regenerationStatisticRegister(
        actor: FighterCombatEntity,
        fight: FightEntity,
        healingResult: HealingResolution,
        manaResult: RestoreManaResult
    ): void {
        actor.statistics.registerHealing({
            type: 'regeneration',
            amount: healingResult.effectiveHealing
        })

        actor.statistics.registerResources({
            manaRegenerated: manaResult.effectiveRestoration
        })

        healingResult.reductions.forEach(reductionDetail => {
            const fighter = fight.getFighter(reductionDetail.sourceFighterId)
            fighter.statistics.registerHealing({
                type: 'prevented',
                amount: reductionDetail.preventedAmount
            })
        })
    }
}