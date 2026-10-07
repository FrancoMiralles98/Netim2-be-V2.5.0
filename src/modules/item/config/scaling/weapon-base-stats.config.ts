import { TypeWeapon } from "netim2-shared";
import { WeaponDamageScalingConfig } from "../../types/config/equip-base-stats.type";

export const WEAPON_BASE_STAT_CONFIG: Record<TypeWeapon, WeaponDamageScalingConfig> = {
    flecha: { //Ya balanceado
        ad: {
            min: { base: 7, perLv: 1.55, power: 1.05 },
            max: { base: 29, perLv: 2.05, power: 1.04 },
        },
    },

    campana: {
        ad: {
            min: { base: 7, perLv: 2.05, power: 1.05 },
            max: { base: 29, perLv: 2.75, power: 1.04 },
        },
        ap: {
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
        ap: {
            min: { base: 7, perLv: 2.05, power: 1.05 },
            max: { base: 29, perLv: 2.75, power: 1.04 },
        },
    },

    fan: {
        ad: {
            min: { base: 7, perLv: 2.05, power: 1.05 },
            max: { base: 29, perLv: 2.75, power: 1.04 },
        },
        ap: {
            min: { base: 7, perLv: 2.05, power: 1.05 },
            max: { base: 29, perLv: 2.75, power: 1.04 },
        },
    },


}