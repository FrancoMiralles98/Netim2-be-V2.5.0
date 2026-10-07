import { EquipType } from "netim2-shared";
import { EQUIP_RULES } from "../../config/items-rule.const";

export const BASE_EQUIP_ITEM = {
  upgradeLv: 0,
  upgradeMax: EQUIP_RULES.MAX_NORMAL_UPGRADE_LV,
  type: 'equip',
  acc: false,
  explicitBonus: [],
  implicitBonus: [],
  piedras: [],
  weight: 0,
  itemLv: 0,
  bonus6_7: [],
  corruptExplicitBonus: [],
  corruptImplicitBonus: [],
  corruptSpecialBonus: [],
  legendary: false,
  randomImplicitBonus: [],
  corrupt: false,
} satisfies Partial<EquipType>;