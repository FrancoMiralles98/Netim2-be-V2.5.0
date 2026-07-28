import { randomUUID } from "crypto";
import { ActiveAuraEntity } from "../entities/active-aura.entity";
import { ActivateAuraInput, AuraDeactivationResult, AuraStatModifierInput, DeactivateAllOwnedAurasInput, DeactivateAuraBySkillIdInput, DeactivateAuraInput } from "../types/auraManager/auraManager.types";
import { Injectable } from "@nestjs/common";
import { UNIQUE_ID_SKILLS } from "netim2-shared";
import { CombatStatModifier } from "../types/activeAura/active-aura.type";
import { FighterCombatEntity } from "../entities/fighter-combat.entity";

@Injectable()
export class AuraManager {
    activate(input: ActivateAuraInput): ActiveAuraEntity {
        this.validateActivation(input);

        const instanceId = randomUUID();

        const appliedModifiers = this.createAppliedModifiers({
            instanceId,
            skillId: input.skill.id,
            modifiers: input.modifiers
        });

        const aura = new ActiveAuraEntity({
            instanceId,
            skill: input.skill,
            sourceFighterId: input.source.id,
            activatedOnTurn: input.activatedOnTurn,
            appliedModifiers
        });

        input.source.addAura(aura);

        input.source.addStatModifiers(aura.getStatModifiers());

        return aura;
    }

    deactivate(input: DeactivateAuraInput): AuraDeactivationResult {
        const { owner, aura } = input;

        this.validateAuraOwnership(owner, aura);

        if (!aura.isActive()) {
            return {
                auraInstanceId: aura.getInstanceId(),
                skillId: aura.getSkillId(),
                deactivated: false,
            };
        }

        owner.removeStatModifiersByAuraInstance(
            aura.getInstanceId()
        );

        aura.deactivate();

        owner.removeStatModifiersByAuraInstance(aura.getInstanceId());

        return {
            auraInstanceId: aura.getInstanceId(),
            skillId: aura.getSkillId(),
            deactivated: true,
        };
    }

    deactivateBySkillId(
        input: DeactivateAuraBySkillIdInput
    ): AuraDeactivationResult | undefined {
        const aura = input.owner.getActiveAuraBySkillId(input.skillId);

        if (!aura) {
            return undefined;
        }

        return this.deactivate({
            owner: input.owner,
            aura,
        });
    }

    deactivateAllOwnedAuras(input: DeactivateAllOwnedAurasInput): AuraDeactivationResult[] {
        /*
         * Se crea una copia porque deactivate() elimina
         * elementos del Map de auras del luchador.
         */
        const activeAuras = [
            ...input.owner.getActiveAuras()
        ];

        return activeAuras.map((aura) =>
            this.deactivate({
                owner: input.owner,
                aura
            })
        );
    }

    private createAppliedModifiers(input: {
        instanceId: string;
        skillId: UNIQUE_ID_SKILLS;
        modifiers: AuraStatModifierInput[];
    }): CombatStatModifier[] {
        return input.modifiers.map((modifier) => ({
            id: randomUUID(),

            source: {
                type: 'aura',
                instanceId: input.instanceId,
                skillId: input.skillId
            },

            target: modifier.target,
            operation: modifier.operation,
            value: modifier.value
        }));
    }

    private validateActivation(input: ActivateAuraInput): void {
        if (!input.source.isAlive()) {
            throw new Error('A defeated fighter cannot activate an aura.');
        }

        if (input.source.hasActiveAuraBySkillId(input.skill.id)) {
            throw new Error(`Aura ${input.skill.id} is already active.`);
        }

        if (input.modifiers.length === 0) {
            throw new Error(`Aura ${input.skill.id} does not contain modifiers.`);
        }

        for (const modifier of input.modifiers) {
            this.validateModifier(modifier);
        }
    }

    private validateModifier(modifier: AuraStatModifierInput): void {
        if (!Number.isFinite(modifier.value)) {
            throw new Error(`Invalid aura modifier value for ${modifier.target}.`);
        }

        if (modifier.operation !== 'flat' && modifier.value < 0) {
            throw new Error(`The ${modifier.operation} modifier cannot have a negative value.`);
        }
    }

    private validateAuraOwnership(owner: FighterCombatEntity, aura: ActiveAuraEntity): void {
        if (aura.getSourceFighterId() !== owner.id) {
            throw new Error(`Aura ${aura.getInstanceId()} does not belong to fighter ${owner.id}.`);
        }
    }
}