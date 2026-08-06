import { Injectable } from "@nestjs/common";
import { ApplyStatusEffectInput } from "../types/statusEffectManager/status-Effect-manager";
import { ActiveStatusEffectEntity } from "../entities/active-status-effect.entity";
import { randomUUID } from "crypto";
import { FighterCombatEntity } from "../entities/fighter-combat.entity";
import { StatsModifiers, StatusEffectsKeys } from "netim2-shared";
import { CombatStatModifier } from "../types/activeAura/active-aura.type";
import { isPeriodicDamageEffectData } from "../types/statusEffects/effect-data.types";

@Injectable()
export class StatusEffectManager {

    apply(input: ApplyStatusEffectInput): ActiveStatusEffectEntity {
        const existingEffect = input.target.getActiveStatusEffectByEffectId(input.effectId);

        if (existingEffect) {
            return this.handleReapplication(existingEffect, input);
        }

        const instanceId = randomUUID();

        const statModifiers =
            this.createStatModifiers({
                instanceId,
                effectId: input.effectId,
                modifiers: input.modifiers,
                sourceFighterId: input.source.id
            });

        const effect = new ActiveStatusEffectEntity({
            instanceId,

            effectId: input.effectId,
            lastAppliedOnTurn: input.appliedOnTurn,

            sourceFighterId: input.source.id,

            targetFighterId: input.target.id,

            appliedOnTurn: input.appliedOnTurn,

            duration: input.duration,

            data: input.data,

            statsModifier: statModifiers,

            stacks: input.stacks
                ? {
                    current: input.stacks.initial,
                    toApplyExtraDamage: input.stacks.toApplyExtraDamage,
                }
                : undefined
        });

        input.target.addActiveStatusEffect(effect);

        input.target.addStatModifiers(statModifiers);

        return effect;
    }

    deactivate(owner: FighterCombatEntity, effect: ActiveStatusEffectEntity): void {

        if (effect.getTargetFighterId() !== owner.id) {
            throw new Error(`Status effect ${effect.getInstanceId()} does not belong to fighter ${owner.id}.`);
        }

        owner.removeStatModifiersByStatusEffectInstance(effect.getInstanceId())

        effect.desactivate()

        owner.removeActiveStatusEffectByIstanceId(effect.getInstanceId())
    }

    advanceTurn(target: FighterCombatEntity, currentTurn: number): ActiveStatusEffectEntity[] {
        const expired: ActiveStatusEffectEntity[] = [];

        const activeEffects = target.getActiveStatusEffects();

        for (const effect of activeEffects) {
            if (!effect.isActive()) {
                continue;
            }

            /*
             * No consumir duración durante
             * el mismo turno global en que
             * fue aplicado.
             */
            if (effect.getlastAppliedOnTurn() === currentTurn) {
                continue;
            }

            const durationResult = effect.advanceTurn();

            if (durationResult.expired) {
                this.deactivate(target, effect);
                expired.push(effect);
            }
        }

        return expired;
    }

    private handleReapplication(
        existingEffect: ActiveStatusEffectEntity,
        input: ApplyStatusEffectInput,
    ): ActiveStatusEffectEntity {
        const stacks = existingEffect.getStacks();

        if (stacks) {
            existingEffect.addStack();
        }

        if (input.duration.type === 'until_no_mana') {
            this.deactivate(input.target, existingEffect);
            return this.apply(input);
        }

        existingEffect.reapplyDuration(input.duration.turns, input.canStackDuration)

        const existingData = existingEffect.Effectdata
        const incomingData = input.data

        if (isPeriodicDamageEffectData(existingData) && isPeriodicDamageEffectData(incomingData)) {
            if (incomingData.damagePerTick > existingData.damagePerTick) {
                this.replaceEffectApplication(existingEffect, input)
            }
            return existingEffect
        }

        if (isPeriodicDamageEffectData(existingData) !== isPeriodicDamageEffectData(incomingData)) {
            throw new Error(`Effect ${input.effectId} was reapplied with an incompatible data type.`);
        }

        this.replaceEffectApplication(existingEffect, input);

        return existingEffect;
    }

    private replaceEffectApplication(effect: ActiveStatusEffectEntity, input: ApplyStatusEffectInput) {
        input.target.removeStatModifiersByStatusEffectInstance(effect.getInstanceId())

        const newStatsModifers = this.createStatModifiers({
            effectId: effect.getEffectId(),
            instanceId: effect.getInstanceId(),
            modifiers: input.modifiers,
            sourceFighterId: input.source.id
        })

        effect.replaceApplication({
            appliedOnTurn: input.appliedOnTurn,
            data: input.data,
            sourceFighterId: input.source.id
        })

        effect.replaceStatModifiers(newStatsModifers)

        input.target.addStatModifiers(newStatsModifers)
    }

    private createStatModifiers(input: {
        instanceId: string;
        effectId: StatusEffectsKeys;
        sourceFighterId: string;
        modifiers: readonly StatsModifiers[];
    }): CombatStatModifier[] {
        return input.modifiers.map(
            modifier => ({
                id: randomUUID(),

                source: {
                    type: 'status_effect',
                    instanceId: input.instanceId,
                    effectId: input.effectId,
                    sourceFighterId: input.sourceFighterId
                },

                target: modifier.target,

                operation: modifier.operation,

                value: modifier.value
            })
        );
    }
}