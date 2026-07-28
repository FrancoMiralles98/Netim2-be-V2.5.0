import { SkillAura, UNIQUE_ID_SKILLS } from "netim2-shared";
import { CombatStatModifier, CreateActiveAuraProps } from "../types/activeAura/active-aura.type";
import { ActiveDurationEntity } from "./active-duration.entity";

export class ActiveAuraEntity {
    private readonly instanceId: string;
    private readonly skill: SkillAura;

    private readonly sourceFighterId: string;

    private readonly activatedOnTurn: number;

    private readonly duration: ActiveDurationEntity;

    private readonly appliedModifiers: CombatStatModifier[];

    private totalManaSpent = 0;

    private active = true;

    constructor(props: CreateActiveAuraProps) {
        this.instanceId = props.instanceId;
        this.skill = props.skill;

        this.sourceFighterId = props.sourceFighterId;

        this.activatedOnTurn = props.activatedOnTurn;

        this.duration = ActiveDurationEntity.create(props.skill.duration!);

        this.appliedModifiers = props.appliedModifiers;
    }

    getInstanceId(): string {
        return this.instanceId;
    }

    getSourceFighterId(): string {
        return this.sourceFighterId
    }

    getSkillId(): UNIQUE_ID_SKILLS {
        return this.skill.id;
    }

    isActive(): boolean {
        return this.active;
    }

    hasStatModifiers(): boolean {
        return this.appliedModifiers.length > 0;
    }

    getStatModifiers(): readonly CombatStatModifier[] {
        return this.appliedModifiers;
    }

    getInitialManaCost(): number {
        if (this.skill.mana.type !== 'upkeep') {
            return 0;
        }
        return this.skill.mana.initialAmount ?? 0;
    }

    getUpkeepManaCost(): number {
        if (this.skill.mana.type !== 'upkeep') {
            return 0;
        }
        return this.skill.mana.amountPerTurn;
    }

    registerManaPayment(amount: number): void {
        if (!this.active) {
            throw new Error(
                `Cannot pay mana for inactive aura ${this.instanceId}`
            );
        }
        this.totalManaSpent += amount;
    }

    advanceTurn() {
        const result = this.duration.advanceTurn();
        return result;
    }

    deactivate(): void {
        if (!this.active) return
        this.active = false;
    }
}