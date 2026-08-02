import { DamageType, UNIQUE_ID_SKILLS } from "netim2-shared";

export interface PreparedSkillDamageComponent {
    componentIndex: number;

    damageType: DamageType;

    range: {
        min: number;
        max: number;
    };
}

export interface PreparedSkillDamage {
    skillId: UNIQUE_ID_SKILLS;

    components: PreparedSkillDamageComponent[];
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