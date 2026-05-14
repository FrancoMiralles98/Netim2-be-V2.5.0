import { UNIQUE_ID_SKILLS } from "../props/unique-id-skill.enum"

/**
 * Configuración de bonus de daño por skill.
 *
 * La key representa el ID único de la skill y el valor define
 * cómo se comporta su bonus de daño adicional.
 *
 * Puede ser:
 * - `ChanceDescription`: bonus basado en una probabilidad fija/escalable.
 * - `TierBonusDamageDescription`: bonus dividido por tiers, que cada tier depende del masteryRankLv que tenga
 */
export type BonusDamageConfigType = Partial<Record<UNIQUE_ID_SKILLS, ChanceDescription | TierBonusDamageDescription>>



/**
 * Configuración de bonus de daño por tiers.
 *
 * Cada tier contiene sus propias probabilidades y multiplicadores
 * de daño adicional.
 *
 * Ejemplo:
 * - Tier 1: cuando la habilidad esta en lv numerico (del lv 1 al 16)
 * - Tier 4: cuando la habilidad esta en su rango maximo (P) 
 */
export interface TierBonusDamageDescription {
    type: 'tier';
    tiers: TierDescription[]
}

export interface TierDescription {
    tier: 1 | 2 | 3 | 4,
     /**
     * Configuración de multiplicadores de daño disponibles
     * para este tier.
     *
     * Cada entrada define:
     * - chance: probabilidad de activarse.
     * - multi: multiplicador de daño aplicado.
     */
    damageConfig: {
        damage_x2?: { chance: number, multi: number },
        damage_x3?: { chance: number, multi: number },
        damage_x4?: { chance: number, multi: number };
        damage_x5?: { chance: number, multi: number };
    }
}

/**
 * Configuración de bonus de daño basada en probabilidad.
 *
 * La chance aumenta según el nivel de la skill
 * y aplica un multiplicador de daño cuando se activa.
 */
export interface ChanceDescription {
    type: 'chance';
    baseChance: number;
    chancePerLv: number;
    multi: number;
}