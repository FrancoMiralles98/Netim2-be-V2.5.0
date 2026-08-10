import { Injectable } from "@nestjs/common";
import { PeriodicStatusEffectResolution } from "../../types/actionResolution/action-resolution.types";
import { FightEntity } from "../../entities/fight.entity";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";
import { ActiveStatusEffectEntity } from "../../entities/active-status-effect.entity";
import { hasStackExtraDamage, isPeriodicDamageEffectData } from "../processors/status-effect-processor.types";
import { DamageResolverService } from "./damage-resolver.service";
import { PeriodicDamageEffectData } from "../../types/statusEffects/effect-data.types";

@Injectable()
export class PeriodicStatusEffectResolverService {
    constructor(
        private damageResolverService: DamageResolverService
    ) { }

    resolve(input: {
        fight: FightEntity,
        target: FighterCombatEntity,
        effect: ActiveStatusEffectEntity
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

        let totalAppliedDamage = tickDamage.effectiveDamage

        let stackProc: PeriodicStatusEffectResolution['stackProc'];

        if (input.target.isAlive()) {
            stackProc = this.resolveStackDamage({
                data,
                effect: input.effect,
                source,
                target: input.target
            })

            if (stackProc) {
                totalAppliedDamage += stackProc.damage.effectiveDamage;
            }
        }

        input.effect.registerTick()

        return {
            effectId: input.effect.getEffectId(),
            instanceId: input.effect.getInstanceId(),
            sourceFighterId: source.id,
            targetDefeated: !input.target.isAlive(),
            targetFighterId: input.target.id,
            tickDamage,
            totalAppliedDamage,
            stackProc,
            tickNumber: input.effect.getTicksExecuted()
        }
    }

    private resolveStackDamage(input: {
        source: FighterCombatEntity;

        target: FighterCombatEntity;

        effect: ActiveStatusEffectEntity;

        data: PeriodicDamageEffectData
    }
    ): PeriodicStatusEffectResolution['stackProc'] | undefined {
        if (!hasStackExtraDamage(input.data)) {
            return undefined
        }

        const stackResult = input.effect.consumeStacksForExtraDamage()

        if (!stackResult.triggered) {
            return undefined
        }

        const damagePerProc = input.data.extraDamageToApplyStacks *
            input.data.damagePerTick;

        const totalRequestedDamage = damagePerProc * stackResult.procCount

        const damage = this.damageResolverService.resolve({
            sourceType: 'status_effect',
            attacker: input.source,
            target: input.target,
            damage: totalRequestedDamage,
            damageType: 'ad',
            effect: input.effect
        })

        return {
            consumedStacks: stackResult.consumedStacks,
            damage,
            damagePerProc,
            procCount: stackResult.procCount,
            remainingStacks: stackResult.remainingStacks,
            totalRequestedDamage
        }
    }
}