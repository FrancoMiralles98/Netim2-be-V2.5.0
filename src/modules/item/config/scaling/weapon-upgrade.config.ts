import { WeaponDamageScalingConfig } from "../../types/config/equip-base-stats.type";
import { TypeWeapon } from "../../types/entities-props/equip.type";

/**
 * @note - En Upgrade los "base" tiene que ir en 0 porque aca solo se toma el "perLv" y "power"
 */
export const WEAPON_UPGRADE_STAT_CONFIG: Record<TypeWeapon, WeaponDamageScalingConfig> = {
    flecha: {
        ad: {
            min: { base: 0, perLv: 2.05, power: 1.05 },
            max: { base: 0, perLv: 2.75, power: 1.04 },
        },
    },

    campana: {
        ad: {
            min: { base: 0, perLv: 2.05, power: 1.05 },
            max: { base: 0, perLv: 2.75, power: 1.04 },
        },
        ap: {
            min: { base: 0, perLv: 2.05, power: 1.05 },
            max: { base: 0, perLv: 2.75, power: 1.04 },
        },
    },

    daga: {
        ad: {
            min: { base: 0, perLv: 2.05, power: 1.05 },
            max: { base: 0, perLv: 2.75, power: 1.04 },
        },
    },

    dos_manos: {
        ad: {
            min: { base: 0, perLv: 2.05, power: 1.05 },
            max: { base: 0, perLv: 2.75, power: 1.04 },
        },
    },

    espada: {
        ad: {
            min: { base: 0, perLv: 2.05, power: 1.05 },
            max: { base: 0, perLv: 2.75, power: 1.04 },
        },
        ap: {
            min: { base: 0, perLv: 2.05, power: 1.05 },
            max: { base: 0, perLv: 2.75, power: 1.04 },
        },
    },

    fan: {
        ad: {
            min: { base: 0, perLv: 2.05, power: 1.05 },
            max: { base: 0, perLv: 2.75, power: 1.04 },
        },
        ap: {
            min: { base: 0, perLv: 2.05, power: 1.05 },
            max: { base: 0, perLv: 2.75, power: 1.04 },
        },
    },


}