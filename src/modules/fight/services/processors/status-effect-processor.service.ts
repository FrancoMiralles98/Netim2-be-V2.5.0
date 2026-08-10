import { Injectable } from "@nestjs/common";
import { TurnContext } from "../../types/fight/fight-context.types";
import { isPeriodicDamageEffectData } from "./status-effect-processor.types";
import { PeriodicEffectsTurnStartResult } from "../../types/turns/turn.types";
import { PeriodicStatusEffectResolution } from "../../types/actionResolution/action-resolution.types";
import { PeriodicStatusEffectResolverService } from "../resolvers/periodic-status-effect-resolver.service";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";

@Injectable()
export class StatusEffectProcessorService {

    constructor(
        private periodicStatusEffectService: PeriodicStatusEffectResolverService
    ) {

    }

    process(context: TurnContext): PeriodicEffectsTurnStartResult {
        const actorStatusEffects = [...context.actor.getActiveStatusEffects()]

        const results: PeriodicStatusEffectResolution[] = [];
        let totalAppliedDamage = 0;

        for (const statusEffect of actorStatusEffects) {
            if (!context.actor.isAlive()) {
                break;
            }

            if (!statusEffect.isActive()) continue;

            if (statusEffect.getTargetFighterId() !== context.actor.id) continue;

            const data = statusEffect.Effectdata

            if (!isPeriodicDamageEffectData(data)) continue

            const result = this.periodicStatusEffectService.resolve({
                effect: statusEffect,
                fight: context.fight,
                target: context.actor
            })

            results.push(result)

            const source = context.fight.getFighter(result.sourceFighterId)

            this.statisticsRegister(source, context.actor, result)

            totalAppliedDamage += result.totalAppliedDamage
        }

        return {
            effects: results,
            actorDefeated: !context.actor.isAlive(),
            totalAppliedDamage
        }
    }


    private statisticsRegister(
        source: FighterCombatEntity,
        actor: FighterCombatEntity,
        result: PeriodicStatusEffectResolution
    ): void {

        source.statistics.registerEffects({
            appliedByType: { [result.effectId]: 1 },
        })

        source.statistics.registerDamageDealt({
            delivery: 'periodic',
            source: {
                type: 'status_effect',
                effectId: result.effectId
            },
            amount: result.totalAppliedDamage,
            damageType: 'ad' //se añade pero no se usa, deberia tener un return para evitar que register mitigacion de ad
        })

        actor.statistics.registerEffects({
            receivedByType: { [result.effectId]: 1 },
        })

        actor.statistics.registerDamageMitigated({
            amount: result.tickDamage.mitigatedAmount,
            damageType: 'ad',
            statusEffectId: result.effectId
        })
    }
}