import { DamageType, StatusEffectsKeys, UNIQUE_ID_SKILLS } from "netim2-shared";

export interface DamageStatistics {
    dealt: DamageStatistics
    mitigated: DamageMitigationStatistics;
}

export interface DamageStatistics {
    total: number;

    byDamageType: Record<DamageType, number>;

    byDelivery: Record<DamageDelivery, number>;

    bySkill: Partial<Record<UNIQUE_ID_SKILLS, SkillDamageStatistics>>

    bySource: DamageSourceStatistics

    byStatusEffect: Partial<Record<StatusEffectsKeys, number>>;
}

export type DamageDelivery =
    | 'direct'
    | 'periodic'
    | 'reflected';

export interface DamageSourceStatistics {
    basicAttack: number;
    skills: number;
    statusEffects: number;
    reflected: number;
}

export interface SkillDamageStatistics {
    total: number;
    periodicFromEffects: number;
    totalAttributed: number;
}

export interface DamageMitigationStatistics {
    total: number;

    byDamageType: Record<DamageType, number>;

    byStatusEffect: Record<StatusEffectsKeys,number>;
}
