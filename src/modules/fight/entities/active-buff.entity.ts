import { UNIQUE_ID_SKILLS } from "netim2-shared";
import { CombatStatModifier } from "../types/activeAura/active-aura.type";
import { ActiveBuffEffect, ActiveNextSkillDamageMultiplier, CreateActiveBuffProps } from "../types/activeBuff/activeBuff.type";
import { ActiveDurationEntity } from "./active-duration.entity";

export class ActiveBuffEntity {
    private readonly instanceId: string;
    private readonly skillId: UNIQUE_ID_SKILLS;

    private readonly sourceFighterId: string;

    private readonly appliedOnTurn: number;

    private readonly duration: ActiveDurationEntity;

    private readonly effects: ActiveBuffEffect[];

    private readonly appliedModifiers: CombatStatModifier[];

    private active = true;

    constructor(props: CreateActiveBuffProps) {
        this.instanceId = props.instanceId;
        this.skillId = props.skillId;

        this.sourceFighterId = props.sourceFighterId;

        this.appliedOnTurn = props.appliedOnTurn;

        this.duration = ActiveDurationEntity.create(props.duration);

        this.effects = props.effects;

        this.appliedModifiers = props.appliedModifiers ?? [];
    }


    isActive(): boolean {
        return this.active;
    }

    getBuffId(): UNIQUE_ID_SKILLS {
        return this.skillId
    }

    getInstanceId(): string {
        return this.instanceId
    }

    supportsSkill(skillId: UNIQUE_ID_SKILLS): boolean {
        return this.effects.some(effect => {
            if (
                effect.type !==
                'next_skill_damage_multiplier'
            ) {
                return false;
            }

            return (
                effect.remainingUses > 0 &&
                effect.allowedSkillIds.includes(skillId)
            );
        });
    }

    getSkillDamageMultiplier(skillId: UNIQUE_ID_SKILLS): number {
        return this.effects.reduce(
            (multiplier, effect) => {
                if (
                    effect.type ===
                    'next_skill_damage_multiplier' &&
                    effect.remainingUses > 0 &&
                    effect.allowedSkillIds.includes(skillId)
                ) {
                    return multiplier * effect.multiplier;
                }

                return multiplier;
            },
            1
        );
    }

    consumeForSkill(
        skillId: UNIQUE_ID_SKILLS,
        trigger: ActiveNextSkillDamageMultiplier['consumeOn']
    ): boolean {
        let consumed = false;

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
            consumed = true;
        }

        if (!this.hasAvailableEffects()) {
            this.active = false;
        }

        return consumed;
    }

    advanceTurn() {
        const result = this.duration.advanceTurn();

        if (result.expired) {
            this.active = false;
        }

        return result;
    }


    private hasAvailableEffects(): boolean {
        return this.effects.some(effect => {
            if (effect.type === 'next_skill_damage_multiplier') {
                return effect.remainingUses > 0;
            }

            return true;
        });
    }

    getStatModifiers(): readonly CombatStatModifier[] {
        return this.appliedModifiers;
    }
}