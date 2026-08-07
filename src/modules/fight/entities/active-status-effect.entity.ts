import { StatusEffectsKeys, UNIQUE_ID_SKILLS } from "netim2-shared";
import { ActiveStatusEffectId, CreateActiveStatusEffectProps } from "../types/statusEffects/active-status-effect.types";
import { ActiveDurationEntity } from "./active-duration.entity";
import { ActiveStatusEffectData } from "../types/statusEffects/effect-data.types";
import { CombatStatModifier } from "../types/activeAura/active-aura.type";

export class ActiveStatusEffectEntity {
    private readonly instanceId: string;
    private readonly effectId: ActiveStatusEffectId;

    private sourceFighterId: string;
    private targetFighterId: string;

    private readonly sourceSkillId?: UNIQUE_ID_SKILLS;

    private appliedOnTurn: number;
    private lastAppliedOnTurn: number

    private duration: ActiveDurationEntity;

    private stacks?: { current: number, toApplyExtraDamage: number }

    private ticksExecuted = 0;

    private data: ActiveStatusEffectData;

    private statsModifier: CombatStatModifier[]

    private active = true;

    constructor(props: CreateActiveStatusEffectProps) {
        this.instanceId = props.instanceId;

        this.effectId = props.effectId;
        this.lastAppliedOnTurn = props.lastAppliedOnTurn;

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

    getlastAppliedOnTurn() {
        return this.lastAppliedOnTurn
    }

    getEffectId(): ActiveStatusEffectId {
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

    getRemainingTurns(): number | undefined {
        return this.duration.getRemainingTurns()
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

    desactivate(): void {
        this.active = false
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
        this.stacks = {
            ...this.stacks,
            current: this.stacks.current + 1
        }

        return { ...this.stacks }
    }

    reapplyDuration(duration: number, canStackDuration: boolean) {
        const result = this.duration.addTurns(duration, canStackDuration)
        return result
    }

    replaceApplication(input: {
        sourceFighterId: string;
        sourceSkillId?: UNIQUE_ID_SKILLS;
        data: ActiveStatusEffectData;
        appliedOnTurn: number;
    }): void {
        if (!this.active) {
            throw new Error(`Cannot replace inactive effect ${this.instanceId}.`);
        }

        this.sourceFighterId = input.sourceFighterId;
        this.data = input.data;
        this.lastAppliedOnTurn = input.appliedOnTurn;
    }


    replaceStatModifiers(modifiers: CombatStatModifier[]): void {
        if (!this.active) {
            throw new Error(
                `Cannot replace modifiers of inactive effect ${this.instanceId}.`
            );
        }

        this.statsModifier = [...modifiers];
    }
}