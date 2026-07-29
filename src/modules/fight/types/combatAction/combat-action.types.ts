import { UNIQUE_ID_SKILLS } from "netim2-shared";

export type CombatAction =
    | CastAuraAction
    | CastBuffAction
    | UseHealingSkillAction
    | UseDamageSkillAction
    | BasicAttackAction
    | SkipTurnAction;

export interface CastAuraAction {
    type: 'cast_aura';

    skillId: UNIQUE_ID_SKILLS;
}

export interface CastBuffAction {
    type: 'cast_buff';

    skillId: UNIQUE_ID_SKILLS;

    targetId: string;
}

export interface UseHealingSkillAction {
    type: 'use_healing_skill';

    skillId: UNIQUE_ID_SKILLS;

    targetId: string;
}

export interface UseDamageSkillAction {
    type: 'use_damage_skill';

    skillId: UNIQUE_ID_SKILLS;

    targetId: string;
}

export interface BasicAttackAction {
    type: 'basic_attack';

    targetId: string;
}

export interface SkipTurnAction {
    type: 'skip_turn';

    reason: 'no_valid_target' | 'no_available_action';
}