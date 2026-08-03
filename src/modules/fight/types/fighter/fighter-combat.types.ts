import { AllTargetType, CharacterRace, SkillType, UNIQUE_ID_SKILLS } from "netim2-shared";
import { TypeWeapon } from "netim2-shared/dist/item/entities-props/equip.type";
import { FighterBaseStats } from "./fight-base-stats.type";
import { ActiveAuraEntity } from "../../entities/active-aura.entity";
import { ActiveBuffEntity } from "../../entities/active-buff.entity";
import { ActiveStatusEffectEntity } from "../../entities/active-status-effect.entity";
import { FightCombatStatisticsTracker } from "../../statistics/fight-combat-statistics.tracker";
import { CombatStatModifier } from "../activeAura/active-aura.type";

export interface CreateFighterCombatProps {
    id: string;
    name: string;
    targetType: AllTargetType;
    weaponType?: TypeWeapon;
    race?: CharacterRace
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
    statModifiers: Map<string, CombatStatModifier>;
    race?: CharacterRace
    statistics: FightCombatStatisticsTracker;

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