import { DamageType, StatusEffectsKeys, UNIQUE_ID_SKILLS } from "netim2-shared";

export interface DamageStatistics {
    dealt: DamageDealStatistics
    mitigated: DamageMitigationStatistics;
}

export interface DamageDealStatistics {
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
    damageType: DamageType;
}

export interface DamageMitigationStatistics {
    total: number;

    byDamageType: Record<DamageType, number>;

    byStatusEffect: Partial<Record<StatusEffectsKeys,number>>
}
