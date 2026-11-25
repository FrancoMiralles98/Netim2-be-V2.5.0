import { Injectable } from "@nestjs/common";
import { PeriodicStatusEffectResolution } from "../../types/actionResolution/action-resolution.types";
import { FightEntity } from "../../entities/fight.entity";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";
import { ActiveStatusEffectEntity } from "../../entities/active-status-effect.entity";
import { isPeriodicDamageEffectData } from '../processors/status-effect-processor.types';
import { DamageResolverService } from "./damage-resolver.service";
import { ActiveStatusEffectId } from "../../types/statusEffects/active-status-effect.types";
import { DamageResolutionResult } from "./damage-resolver.types";
import { TurnContext } from "../../types/fight/fight-context.types";

@Injectable()
export class PeriodicStatusEffectResolverService {
    constructor(
        private damageResolverService: DamageResolverService
    ) { }

    /** Aplica únicamente el tick; los stacks se detonan al aplicar el estado. */
    resolve(input: {
        fight: FightEntity,
        target: FighterCombatEntity,
        effect: ActiveStatusEffectEntity,
        context: TurnContext
    }): PeriodicStatusEffectResolution {

        if (!input.effect.isActive()) {
            throw new Error(`Cannot resolve inactive effect ${input.effect.getInstanceId()}.`);
        }

        const data = input.effect.Effectdata

        if (!isPeriodicDamageEffectData(data)) {
            throw new Error(`Effect ${input.effect.getEffectId()} is not periodic damage.`)
        }

        const source = input.fight.getFighter(input.effect.getSourceFighterId())

        const tickDamage = this.damageResolverService.resolve({
            sourceType: 'status_effect',
            attacker: source,
            target: input.target,
            damage: data.damagePerTick,
            effect: input.effect,
            damageType: 'ad' //como hereda props de una type base que tiene damageType, se pone cualquier cosa
            //menos true, ya que no pasa por los resolver de mitigacion, despues en el resolver del statusEffect
            //esta prop (damageType) no se usa.
        })

        input.context.events.push({
            type: 'status_effect_ticked',
            effectId: input.effect.getEffectId(),
            appliedDamage: tickDamage.effectiveDamage,
            remainingTurns: input.effect.getRemainingTurns() ?? 0,
            targetCurrentHp: tickDamage.hpAfter,
        })

        const totalAppliedDamage = tickDamage.effectiveDamage;

        input.effect.registerTick()

        this.periodicStatusEffectStatisticRegister(
            tickDamage,
            input.effect.getEffectId(),
            source,
            input.target
        )

        return {
            effectId: input.effect.getEffectId(),
            instanceId: input.effect.getInstanceId(),
            sourceFighterId: source.id,
            targetDefeated: !input.target.isAlive(),
            targetFighterId: input.target.id,
            tickDamage,
            totalAppliedDamage,
            tickNumber: input.effect.getTicksExecuted()
        }
    }

    private periodicStatusEffectStatisticRegister(
        tickDamage: DamageResolutionResult,
        effectId: ActiveStatusEffectId,
        source: FighterCombatEntity,
        target: FighterCombatEntity
    ) {
        target.statistics.registerDamageMitigated({
            statusEffectId: effectId,
            amount: tickDamage.mitigatedAmount
        })
        source.statistics.registerDamageDealt({
            source: {
                type: 'status_effect',
                effectId
            },
            amount: tickDamage.effectiveDamage,
            damageType: 'ad',
            delivery: 'periodic'
        })

    }
}
