import { AllTargetType, SkillType, UNIQUE_ID_SKILLS } from "netim2-shared";
import { TypeWeapon } from "netim2-shared/dist/item/entities-props/equip.type";
import { FighterBaseStats } from "./fight-base-stats.type";
import { FighterCombatStatistics } from "./statistics/fighter-combat-statistics.type";

export interface CreateFighterCombatProps {
    id: string;
    name: string;
    targetType: AllTargetType;
    weaponType?: TypeWeapon;
    baseStats: FighterBaseStats;
    skills: SkillType[]
}

export interface FighterCombatProps {
    id: string;
    name: string;

    targetType: AllTargetType;
    weaponType?: TypeWeapon;

    baseStats: FighterBaseStats;
    effectiveStats: FighterBaseStats;

    resources: FighterResources;

    skills: SkillType[];

    cooldowns: Map<UNIQUE_ID_SKILLS, SkillCooldownState>;

    activeEffects: Map<string, ActiveStatusEffectEntity>;
    activeAuras: Map<string, ActiveAuraEntity>;
    activeBuffs: Map<string, ActiveBuffEntity>;

    statistics: FighterCombatStatistics;

    statsDirty: boolean;
    alive: boolean;
}

export interface SkillCooldownState {
    initialTurns: number;
    remainingTurns: number;
}

export interface FighterResources {
    hp: ResourcePool;
    mana: ResourcePool;
}

export interface ResourcePool {
    current: number;
    max: number;
}