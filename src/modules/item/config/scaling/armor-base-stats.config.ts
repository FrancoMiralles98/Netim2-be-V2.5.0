import { subTypeEquip } from "netim2-shared";
import { ArmorDamageScalingConfig } from "../../types/config/equip-base-stats.type";

export const ARMOR_BASE_STAT_CONFIG: Record<
    Extract<subTypeEquip, 'armadura' | 'casco' | 'escudo' | 'botas'>, ArmorDamageScalingConfig>
    = {
    armadura: {
        def: { base: 7, perLv: 2.05, power: 1.05 },
    },

    botas: {
        def: { base: 7, perLv: 2.05, power: 1.05 },
    },

    casco: {
        def: { base: 7, perLv: 2.05, power: 1.05 },
    },

    escudo: {
        def: { base: 7, perLv: 2.05, power: 1.05 },
    },
}