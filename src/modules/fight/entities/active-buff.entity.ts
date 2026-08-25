import { ActiveBuffEffect, ActiveDurationAdvanceResult, ActiveNextSkillDamageMultiplier, CombatStatModifier, ConsumeBuffForSkillResult, CreateActiveBuffProps, UNIQUE_ID_SKILLS } from "netim2-shared";
import { ActiveDurationEntity } from "./active-duration.entity";

export class ActiveBuffEntity {
    private readonly instanceId: string;
    private readonly skillId: UNIQUE_ID_SKILLS;

    private readonly sourceFighterId: string;
    private readonly targetFighterId: string;

    private readonly appliedOnTurn: number;

    private readonly duration: ActiveDurationEntity;

    private readonly effects: ActiveBuffEffect[];

    private readonly appliedModifiers: CombatStatModifier[];

    private active = true;

    constructor(props: CreateActiveBuffProps) {
        this.instanceId = props.instanceId;
        this.skillId = props.skillId;

        this.sourceFighterId = props.sourceFighterId;

        this.targetFighterId = props.targetFighterId;

        this.appliedOnTurn =
            props.appliedOnTurn;

        this.duration = ActiveDurationEntity.create(props.duration);

        /*
         * Se copian porque algunos efectos contienen estado
         * mutable, como remainingUses.
         */
        this.effects = props.effects.map(effect => ({ ...effect }));

        this.appliedModifiers = [...(props.appliedModifiers ?? [])];
    }

    isActive(): boolean {
        return this.active;
    }

    getInstanceId(): string {
        return this.instanceId;
    }

    getSkillId(): UNIQUE_ID_SKILLS {
        return this.skillId;
    }

    getSourceFighterId(): string {
        return this.sourceFighterId;
    }

    getTargetFighterId(): string {
        return this.targetFighterId;
    }

    getAppliedOnTurn(): number {
        return this.appliedOnTurn;
    }

    getRemainingTurns(): number | undefined {
        return this.duration.getRemainingTurns();
    }

    hasLimitedDuration(): boolean {
        return this.duration.hasLimitedDuration();
    }

    isDurationExpired(): boolean {
        return this.duration.isExpired();
    }

    supportsSkill(skillId: UNIQUE_ID_SKILLS
    ): boolean {
        if (!this.active) {
            return false;
        }

        return this.effects.some(effect => {
            if (effect.type !== 'next_skill_damage_multiplier') {
                return false;
            }

            return (
                effect.remainingUses > 0 &&
                effect.allowedSkillIds.includes(
                    skillId
                )
            );
        });
    }

    getSkillDamageMultiplier(skillId: UNIQUE_ID_SKILLS): number {
        if (!this.active) {
            return 1;
        }

        return this.effects.reduce(
            (multiplier, effect) => {
                if (
                    effect.type === 'next_skill_damage_multiplier' &&
                    effect.remainingUses > 0 &&
                    effect.allowedSkillIds.includes(skillId)
                ) {
                    return (multiplier * effect.multiplier);
                }

                return multiplier;
            },
            1
        );
    }

    consumeForSkill(
        skillId: UNIQUE_ID_SKILLS,
        trigger: ActiveNextSkillDamageMultiplier['consumeOn']
    ): ConsumeBuffForSkillResult {
        if (!this.active) {
            return {
                consumed: false,
                consumedEffects: 0,
                remainingUses: 0,
                depleted: true
            };
        }

        let consumedEffects = 0;

        for (const effect of this.effects) {
            if (effect.type !== 'next_skill_damage_multiplier') {
                continue;
            }

            if (
                effect.consumeOn !== trigger ||
                effect.remainingUses <= 0 ||
                !effect.allowedSkillIds.includes(skillId)
            ) {
                continue;
            }

            effect.remainingUses -= 1;
            consumedEffects += 1;
        }

        const remainingUses =
            this.getTotalRemainingUses();

        const depleted =
            !this.hasAvailableEffects();

        if (depleted) {
            this.deactivate();
        }

        return {
            consumed: consumedEffects > 0,
            consumedEffects,
            remainingUses,
            depleted
        };
    }

    advanceTurn(): ActiveDurationAdvanceResult {
        if (!this.active) {
            return this.duration.advanceTurn();
        }

        const result = this.duration.advanceTurn();

        if (result.expired) {
            this.deactivate();
        }

        return result;
    }

    deactivate(): void {
        if (!this.active) {
            return;
        }
        this.active = false;
    }

    getStatModifiers(): readonly CombatStatModifier[] {
        return this.appliedModifiers;
    }

    hasStatModifiers(): boolean {
        return this.appliedModifiers.length > 0;
    }

    getEffects():readonly ActiveBuffEffect[] {
        return this.effects;
    }

    getTotalRemainingUses(): number {
        return this.effects.reduce((total, effect) => {
            if (effect.type === 'next_skill_damage_multiplier') {
                return (total + effect.remainingUses);
            }
            return total;
        },
            0
        );
    }

    private hasAvailableEffects(): boolean {
        /*
         * Si el buff solo contiene modificadores de stats,
         * su vigencia depende de la duración y no de usos.
         */
        if (this.effects.length === 0) {
            return true;
        }

        return this.effects.some(effect => {
            switch (effect.type) {
                case 'next_skill_damage_multiplier':
                    return effect.remainingUses > 0;
            }
        });
    }
}