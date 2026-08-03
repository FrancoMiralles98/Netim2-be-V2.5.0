import { DamageType, StatusEffectsKeys, UNIQUE_ID_SKILLS } from "netim2-shared";

export interface DamageComponentResolution {
    hitIndex: number;
    componentIndex: number;

    damageType: DamageType;

    baseDamage: number;
    modifiedDamage: number;

    mitigatedDamage: number;
    appliedDamage: number;

    hpBefore: number;
    hpAfter: number;
}

export interface DamageHitResolution {
    hitIndex: number;

    components: DamageComponentResolution[];

    totalAppliedDamage: number;
    totalBaseDamage: number;
    totalModifiedDamage: number;
    totalMitigatedDamage: number;
}

export interface AppliedStatusEffectResolution {
    effectId: StatusEffectsKeys;

    applied: boolean;
    resisted: boolean;

    instanceId?: string;
}

export interface DamageSkillActionResolution {
    type: 'use_damage_skill';
    success: true;

    actorId: string;
    targetId: string;
    skillId: UNIQUE_ID_SKILLS;

    manaSpent: number;
    remainingMana: number;

    cooldownRemainingTurns: number;

    hitCount: number;
    hits: DamageHitResolution[];

    totalBaseDamage: number;
    totalModifiedDamage: number;
    totalMitigatedDamage: number;
    totalAppliedDamage: number;

    statusEffects: AppliedStatusEffectResolution[];

    targetDefeated: boolean;
}