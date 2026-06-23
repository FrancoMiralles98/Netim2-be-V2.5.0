import { EQUIP_RULES } from "src/modules/item/config/items-rule.const";
import { EquipType } from "src/modules/item/types/entities-props/equip.type";

export const BASE_LEGENDARIO_ITEM = {
    upgradeLv: 0,
    upgradeMax: EQUIP_RULES.MAX_NORMAL_UPGRADE_LV,
    type: 'equip',
    acc: false,
    explicitBonus: [],
    implicitBonus: [],
    restricted: ['chaman', 'guerrero', 'ninja', 'sura'],
    piedras: [],
    weight: 0,
    itemLv: 0,
    bonus6_7: [],
    corruptExplicitBonus: [],
    corruptImplicitBonus: [],
    corruptSpecialBonus: [],
    legendary: true,
    randomImplicitBonus: [],
} satisfies Partial<EquipType>;