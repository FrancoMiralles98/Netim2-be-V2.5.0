import { Injectable } from "@nestjs/common";
import { ApplyStatusEffectInput } from "../types/statusEffectManager/status-Effect-manager";
import { ActiveStatusEffectEntity } from "../entities/active-status-effect.entity";
import { randomUUID } from "crypto";
import { FighterCombatEntity } from "../entities/fighter-combat.entity";
import { StatsModifiers, StatusEffectsKeys } from "netim2-shared";
import { CombatStatModifier } from "../types/activeAura/active-aura.type";

@Injectable()
export class StatusEffectManager {
    apply(
        input: ApplyStatusEffectInput
    ): ActiveStatusEffectEntity {
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

            sourceFighterId: input.source.id,

            targetFighterId: input.target.id,

            appliedOnTurn: input.appliedOnTurn,

            duration: input.duration,

            data: input.data,

            statsModifier:
                statModifiers,

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

    private handleReapplication(
        existingEffect: ActiveStatusEffectEntity,
        input: ApplyStatusEffectInput
    ): ActiveStatusEffectEntity {

        const stacks = existingEffect.getStacks();

        if (stacks) {
            existingEffect.addStack();
            return existingEffect;
        }

        /*
         * Regla inicial:
         * si no acumula stacks, reemplazar.
         */
        this.deactivate(input.target, existingEffect);

        return this.apply(input);
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