import { ActiveBuffEffect, ActiveNextSkillDamageMultiplier, SkillBuff, StatsModifiers, UNIQUE_ID_SKILLS } from "netim2-shared";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";
import { ActiveBuffEntity } from "../../entities/active-buff.entity";

export interface ConsumedBuffResult {
    instanceId: string;
    skillId: UNIQUE_ID_SKILLS;

    consumedEffects: number;
    remainingUses: number;

    depleted: boolean;
}

export interface ConsumeBuffsForSkillInput {
    target: FighterCombatEntity;

    skillId: UNIQUE_ID_SKILLS;

    trigger: ActiveNextSkillDamageMultiplier['consumeOn'];
}

export interface BuffDeactivationResult {
    instanceId: string;
    skillId: UNIQUE_ID_SKILLS;

    deactivated: boolean;
}

export interface DeactivateBuffInput {
    target: FighterCombatEntity;
    buff: ActiveBuffEntity;
}

export interface ActivateBuffInput {
    source: FighterCombatEntity;
    target: FighterCombatEntity;

    skill: SkillBuff;

    appliedOnTurn: number;

    effects: ActiveBuffEffect[];

    modifiers: StatsModifiers[];
}
export interface ConsumeBuffsForSkillResult {
    consumed: boolean;
    buffs: ConsumedBuffResult[];
}

