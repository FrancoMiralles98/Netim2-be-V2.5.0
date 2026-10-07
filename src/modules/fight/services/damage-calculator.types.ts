import { BonusRefKeys, DamageTag, DamageType, RoutStatKey, SkillDamageFlags, UNIQUE_ID_SKILLS } from "netim2-shared";

export interface PreparedSkillDamageComponent {
    componentIndex: number;

    damageType: DamageType;

    tags: DamageTag[]

    flags?: SkillDamageFlags;

    runtimeScaling: RuntimeDamageScalingResult;
}

export interface PreparedSkillDamage {
    skillId: UNIQUE_ID_SKILLS;
    components: PreparedSkillDamageComponent[];
}

export interface RuntimeDamageScalingResult {
    originalRange: {
        min: number;
        max: number;
    };

    adjustedRange: {
        min: number;
        max: number;
    };

    totalDamageAdjustment: number;

    scalingDetails: RuntimeDamageScalingDetail[];
}

export interface RuntimeDamageScalingDetail {
    stat: BonusRefKeys;
    target: RoutStatKey;

    ratio: number;

    baseValue: number;
    effectiveValue: number;

    statDifference: number;
    damageAdjustment: number;
}


export interface DamageComponentCalculationResult {
    componentIndex: number;

    damageType: DamageType;

    /**
     * Daño aleatorio obtenido del rango recalculado.
     */
    rolledDamage: number;

    /**
     * Multiplicador definido por el HitModifier.
     */
    hitDamageMultiplier: number;

    /**
     * Daño después del multiplicador por hit.
     *
     * Todavía no incluye:
     * - DamageModifier;
     * - buffs;
     * - crítico;
     * - mitigación.
     */
    amount: number;
}