import { WeaponDamageScalingConfig } from "../../types/config/equip-base-stats.type";
import { TypeWeapon } from "../../types/entities-props/equip.type";

export const WEAPON_BASE_STAT_CONFIG: Record<TypeWeapon, WeaponDamageScalingConfig> = {
    flecha: {
        ad: {
            min: { base: 7, perLv: 2.05, power: 1.05 },
            max: { base: 29, perLv: 2.75, power: 1.04 },
        },
    },

    campana: {
        ad: {
            min: { base: 7, perLv: 2.05, power: 1.05 },
            max: { base: 29, perLv: 2.75, power: 1.04 },
        },
    },

    daga: {
        ad: {
            min: { base: 7, perLv: 2.05, power: 1.05 },
            max: { base: 29, perLv: 2.75, power: 1.04 },
        },
    },

    dos_manos: {
        ad: {
            min: { base: 7, perLv: 2.05, power: 1.05 },
            max: { base: 29, perLv: 2.75, power: 1.04 },
        },
    },

    espada: {
        ad: {
            min: { base: 7, perLv: 2.05, power: 1.05 },
            max: { base: 29, perLv: 2.75, power: 1.04 },
        },
    },

    fan: {
        ad: {
            min: { base: 7, perLv: 2.05, power: 1.05 },
            max: { base: 29, perLv: 2.75, power: 1.04 },
        },
    },


}