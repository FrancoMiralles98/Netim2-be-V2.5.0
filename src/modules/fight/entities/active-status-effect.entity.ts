import { StatusEffectsKeys, UNIQUE_ID_SKILLS } from "netim2-shared";
import { CreateActiveStatusEffectProps } from "../types/statusEffects/active-status-effect.types";
import { ActiveDurationEntity } from "./active-duration.entity";
import { ActiveStatusEffectData } from "../types/statusEffects/effect-data.types";
import { CombatStatModifier } from "../types/activeAura/active-aura.type";
import { DeactivateStatusEffectInput } from "../services/processors/status-effect-processor.types";

export class ActiveStatusEffectEntity {
    private readonly instanceId: string;
    private readonly effectId: StatusEffectsKeys;

    private readonly sourceFighterId: string;
    private readonly targetFighterId: string;

    private readonly sourceSkillId?: UNIQUE_ID_SKILLS;

    private readonly appliedOnTurn: number;

    private readonly duration: ActiveDurationEntity;

    private stacks?: { current: number, toApplyExtraDamage: number }

    private ticksExecuted = 0;

    private readonly data: ActiveStatusEffectData;

    private statsModifier: CombatStatModifier[]

    private active = true;

    constructor(props: CreateActiveStatusEffectProps) {
        this.instanceId = props.instanceId;

        this.effectId = props.effectId;

        this.sourceFighterId = props.sourceFighterId;
        this.targetFighterId = props.targetFighterId;

        this.appliedOnTurn = props.appliedOnTurn;

        this.statsModifier = props.statsModifier

        this.duration = ActiveDurationEntity.create(
            props.duration
        );

        this.stacks = props.stacks ?? undefined;
        this.data = props.data;
    }


    getInstanceId(): string {
        return this.instanceId;
    }

    get Effectdata(): ActiveStatusEffectData {
        return this.data
    }

    getEffectId(): StatusEffectsKeys {
        return this.effectId;
    }

    getSourceFighterId(): string {
        return this.sourceFighterId;
    }

    getTargetFighterId(): string {
        return this.targetFighterId;
    }

    getSourceSkillId(): UNIQUE_ID_SKILLS | undefined {
        return this.sourceSkillId;
    }

    getStacks(): { current: number, toApplyExtraDamage: number } | undefined {
        return this.stacks;
    }

    consumeTurn(): void {
        if (this.duration.getRemainingTurns() === 0) {
            return;
        }

        this.duration.advanceTurn()
    }

    isExpired(): boolean {
        return this.duration.isExpired()
    }


    isActive(): boolean {
        return this.active;
    }

    hasStatModifiers(): boolean {
        return this.statsModifier.length > 0;
    }

    getStatModifiers(): readonly CombatStatModifier[] {
        return this.statsModifier;
    }

    deactivate(input: DeactivateStatusEffectInput): void {
        const { owner, effect } = input;

        if (!effect.isActive()) {
            return;
        }

        if (effect.getTargetFighterId() !== owner.id) {
            throw new Error(`Status effect ${effect.getInstanceId()} does not belong to fighter ${owner.id}.`);
        }

        owner.removeStatModifiersByAuraInstance(effect.getInstanceId());

        owner.removeActiveStatusEffect(effect.getInstanceId());
    }

    registerTick(): void {
        if (!this.active) {
            throw new Error(`Effect ${this.instanceId} is inactive`);
        }

        this.ticksExecuted += 1;
    }

    advanceTurn() {
        const result = this.duration.advanceTurn();

        if (result.expired) {
            this.active = false
        }

        return result;
    }

    addStack(): { current: number; toApplyExtraDamage: number; } {
        if (!this.stacks) {
            throw new Error('Este efecto no tiene la propiedad de stacks')
        }
        const previousStacks = this.stacks;

        this.stacks = {
            ...this.stacks,
            current: this.stacks.current + 1
        }

        return { ...this.stacks }
    }
}