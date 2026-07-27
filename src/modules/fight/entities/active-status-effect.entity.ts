import { StatusEffectsKeys, UNIQUE_ID_SKILLS } from "netim2-shared";
import { CreateActiveStatusEffectProps } from "../types/statusEffects/active-status-effect.types";
import { ActiveDurationEntity } from "./active-duration.entity";
import { ActiveStatusEffectData } from "../types/statusEffects/effect-data.types";
import { CombatStatModifier } from "../types/activeAura/active-aura.type";

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


    isActive(): boolean {
        return this.active;
    }

    hasStatModifiers(): boolean {
        return this.statsModifier.length > 0;
    }

    getStatModifiers(): readonly CombatStatModifier[] {
        return this.statsModifier;
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