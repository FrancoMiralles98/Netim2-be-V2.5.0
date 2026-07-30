import { DurationConfig, StatsModifiers, UNIQUE_ID_SKILLS } from "netim2-shared";
import { CombatStatModifier } from "../activeAura/active-aura.type";

export interface CreateActiveBuffProps {
    instanceId: string;
    skillId: UNIQUE_ID_SKILLS;

    sourceFighterId: string;
    targetFighterId: string;

    appliedOnTurn: number;

    duration: DurationConfig;

    effects: ActiveBuffEffect[];

    appliedModifiers?: CombatStatModifier[];
}

export type ActiveBuffEffect = ActiveNextSkillDamageMultiplier

export interface ActiveNextSkillDamageMultiplier {
    type: 'next_skill_damage_multiplier';

    allowedSkillIds: UNIQUE_ID_SKILLS[];

    multiplier: number;

    remainingUses: number;

    consumeOn: BuffConsumeTrigger;
}

export type BuffConsumeTrigger =
    | 'skill_use'
    | 'successful_hit'
    | 'damage_dealt';

export interface ConsumeBuffForSkillResult {
    consumed: boolean;

    consumedEffects: number;

    remainingUses: number;

    depleted: boolean;
}