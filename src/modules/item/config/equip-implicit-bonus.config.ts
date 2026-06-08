import { EquipImplictBonusConfig } from "../types/config/equip-implicit-bonus.type";
import { ImplicitBonusTierType } from "../types/config/implicit-bonus-tier.type";

/**
 * Define el tier de bonus implícitos random que puede utilizar un equipamiento
 * según su nivel requerido (`lvReq`).
 *
 * Cada rango determina qué configuración de escalado, patrones o valores
 * máximos de bonus implícitos estarán disponibles para el ítem.
 *
 * Rangos:
 * - Nivel 1 a 29   → Tier 1
 * - Nivel 30 a 59  → Tier 2
 * - Nivel 60 o más → Tier 3.
 */
export const IMPLICIT_BONUS_TIER_BY_LV_REQ: Array<{
    maxLv: number
    tier: ImplicitBonusTierType
}> = [
        { maxLv: 29, tier: 1 },
        { maxLv: 59, tier: 2 },
        { maxLv: 999, tier: 3 },
    ]

export const RANDOM_IMPLICIT_BONUS_CONFIG: EquipImplictBonusConfig = {
    quantityByTier: [
        { tier: 1, quantity: 1 },
        { tier: 2, quantity: 2 },
        { tier: 3, quantity: 3 },
    ],
    possibleBonus: [
        {
            bonusRef: 'critico',
            tierValue: [
                { tier: 1, pattern: 'scale_to_10' },
                { tier: 2, pattern: 'scale_to_15' },
                { tier: 3, pattern: 'scale_to_20' },
            ]
        },
        {
            bonusRef: 'penetracion',
            tierValue: [
                { tier: 1, pattern: 'scale_to_10' },
                { tier: 2, pattern: 'scale_to_15' },
                { tier: 3, pattern: 'scale_to_20' },
            ]
        },
        {
            bonusRef: 'daño_critico',
            tierValue: [
                { tier: 1, pattern: 'scale_to_10' },
                { tier: 2, pattern: 'scale_to_15' },
                { tier: 3, pattern: 'scale_to_20' },
            ]
        },
        {
            bonusRef: 'STR',
            tierValue: [
                { tier: 1, pattern: 'scale_to_10' },
                { tier: 2, pattern: 'scale_to_12' },
                { tier: 3, pattern: 'scale_to_15' },
            ]
        },
        {
            bonusRef: 'INT',
            tierValue: [
                { tier: 1, pattern: 'scale_to_10' },
                { tier: 2, pattern: 'scale_to_12' },
                { tier: 3, pattern: 'scale_to_15' },
            ]
        },
        {
            bonusRef: 'DEX',
            tierValue: [
                { tier: 1, pattern: 'scale_to_10' },
                { tier: 2, pattern: 'scale_to_12' },
                { tier: 3, pattern: 'scale_to_15' },
            ]
        },
        {
            bonusRef: 'VIT',
            tierValue: [
                { tier: 1, pattern: 'scale_to_10' },
                { tier: 2, pattern: 'scale_to_12' },
                { tier: 3, pattern: 'scale_to_15' },
            ]
        },

    ],

}

