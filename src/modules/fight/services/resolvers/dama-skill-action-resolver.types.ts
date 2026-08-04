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