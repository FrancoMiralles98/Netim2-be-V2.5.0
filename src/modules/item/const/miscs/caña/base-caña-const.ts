import { CañaType } from "netim2-shared";
import { CAÑA_EXP_X_LV } from "src/modules/item/config/caña.config";
import { EQUIP_RULES } from "src/modules/item/config/items-rule.const";

export const CAÑA_BASE_ITEM = {
    acc: true,
    cantidad: 1,
    lvUtility: 1,
    size: {cols: 3,rows: 1},
    type: 'utility',
    expOfLv: CAÑA_EXP_X_LV[1],
    maxCantidad: 1,
    upgradeLv: 0,
    upgradeMax: EQUIP_RULES.MAX_CAÑA_UPGRADE_LV,
    exp: 0,
    type_utility: 'caña',
} satisfies Partial<CañaType>;