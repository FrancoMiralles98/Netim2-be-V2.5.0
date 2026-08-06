import { Injectable } from "@nestjs/common";
import { ActiveBuffEntity } from "../entities/active-buff.entity";
import { randomUUID } from "crypto";
import { ActivateBuffInput, BuffDeactivationResult, ConsumeBuffsForSkillInput, ConsumeBuffsForSkillResult, ConsumedBuffResult, DeactivateBuffInput } from "../types/buffmanager/buff-manager.types";
import { FighterCombatEntity } from "../entities/fighter-combat.entity";
import { StatsModifiers, UNIQUE_ID_SKILLS } from "netim2-shared";
import { CombatStatModifier } from "../types/activeAura/active-aura.type";

@Injectable()
export class BuffManager {
    activate(input: ActivateBuffInput): ActiveBuffEntity {
        this.validateActivation(input);

        const instanceId = randomUUID();

        const appliedModifiers =
            this.createAppliedModifiers({
                instanceId,
                skillId: input.skill.id,
                modifiers: input.modifiers
            });

        const buff = new ActiveBuffEntity({
            instanceId,
            skillId: input.skill.id,
            sourceFighterId: input.source.id,
            targetFighterId: input.target.id,
            appliedOnTurn: input.appliedOnTurn,
            duration: input.skill.duration,
            effects: input.effects,
            appliedModifiers,
        });

        input.target.addBuff(buff);

        input.target.addStatModifiers(buff.getStatModifiers());

        return buff;
    }

    deactivate(input: DeactivateBuffInput): BuffDeactivationResult {
        const { target, buff } = input;

        this.validateBuffTarget(target, buff);

        const wasActive = buff.isActive();

        /*
         * Aunque la entidad ya se haya marcado como inactiva
         * al consumir su último uso, igualmente hay que limpiar
         * modificadores y eliminarla del Fighter.
         */
        target.removeActiveStatusEffectByIstanceId(buff.getInstanceId());

        target.removeActiveBuff(buff.getInstanceId());

        if (wasActive) {
            buff.deactivate();
        }

        return {
            instanceId: buff.getInstanceId(),
            skillId: buff.getSkillId(),
            deactivated: wasActive,
        };
    }

    deactivateBySkillId(input: {
        target: FighterCombatEntity;
        skillId: UNIQUE_ID_SKILLS;
    }): BuffDeactivationResult | undefined {
        const buff = input.target.getActiveBuffBySkillId(input.skillId);

        if (!buff) {
            return undefined;
        }

        return this.deactivate({ target: input.target, buff, });
    }

    deactivateAllOnTarget(input: { target: FighterCombatEntity; }): BuffDeactivationResult[] {
        /*
         * Creamos una copia porque deactivate() elimina
         * buffs del Map.
         */
        const buffs = [...input.target.getActiveBuffs()];

        return buffs.map(buff => this.deactivate({ target: input.target, buff, }));
    }

    getSkillDamageMultiplier(
        target: FighterCombatEntity,
        skillId: UNIQUE_ID_SKILLS
    ): number {
        return target.getActiveBuffs().reduce((multiplier, buff) => {
            return (multiplier * buff.getSkillDamageMultiplier(skillId)
            );
        },
            1
        );
    }

    consumeForSkill(input: ConsumeBuffsForSkillInput): ConsumeBuffsForSkillResult {
        const consumedBuffs: ConsumedBuffResult[] = [];

        /*
         * Usamos una copia porque los buffs agotados
         * serán eliminados durante el recorrido.
         */
        const buffs = [...input.target.getActiveBuffs()];

        for (const buff of buffs) {
            if (!buff.supportsSkill(input.skillId)) {
                continue;
            }

            const result = buff.consumeForSkill(input.skillId, input.trigger);

            if (!result.consumed) {
                continue;
            }

            consumedBuffs.push({
                instanceId: buff.getInstanceId(),
                skillId: buff.getSkillId(),
                consumedEffects: result.consumedEffects,
                remainingUses: result.remainingUses,
                depleted: result.depleted
            });

            if (result.depleted) {
                this.deactivate({
                    target: input.target,
                    buff,
                });
            }
        }

        return {
            consumed: consumedBuffs.length > 0,
            buffs: consumedBuffs
        };
    }

    advanceTurn(target: FighterCombatEntity, currentTurn: number): ActiveBuffEntity[] {
        const expired: ActiveBuffEntity[] = [];

        const activeBuffs = target.getActiveBuffs();

        for (const buff of activeBuffs) {
            if (!buff.isActive()) {
                continue;
            }

            /*
             * No consumir duración durante
             * el mismo turno global en que
             * fue aplicado.
             */
            if (buff.getAppliedOnTurn() === currentTurn) {
                continue;
            }

            const durationResult = buff.advanceTurn();

            if (durationResult.expired) {
                this.deactivate({ buff, target });
                expired.push(buff);
            }
        }

        return expired;
    }

    private createAppliedModifiers(input: {
        instanceId: string;
        skillId: UNIQUE_ID_SKILLS;
        modifiers: StatsModifiers[];
    }): CombatStatModifier[] {
        return input.modifiers.map(
            modifier => ({
                id: randomUUID(),
                source: {
                    type: 'buff',
                    instanceId: input.instanceId,
                    skillId: input.skillId
                },
                target: modifier.target,
                operation: modifier.operation,
                value: modifier.value
            })
        );
    }

    private validateActivation(
        input: ActivateBuffInput
    ): void {
        if (!input.source.isAlive()) {
            throw new Error(`Defeated fighter ${input.source.id} cannot cast a buff.`);
        }

        if (!input.target.isAlive()) {
            throw new Error(`Buff ${input.skill.id} cannot be applied to defeated fighter ${input.target.id}.`);
        }

        if (input.target.hasActiveBuffBySkillId(input.skill.id)) {
            throw new Error(`Buff ${input.skill.id} is already active on fighter ${input.target.id}.`);
        }
    }

    private validateBuffTarget(
        target: FighterCombatEntity,
        buff: ActiveBuffEntity
    ): void {
        if (buff.getTargetFighterId() !== target.id) {
            throw new Error(`Buff ${buff.getInstanceId()} does not belong to fighter ${target.id}.`);
        }
    }
}