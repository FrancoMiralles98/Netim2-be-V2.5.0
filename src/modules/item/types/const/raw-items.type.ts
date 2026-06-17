import { BASE_EQUIP_ITEM } from "../../const/equip/base-equip.const";
import { BASE_LEGENDARIO_ITEM } from "../../const/equip/legendarios/base-legendario-item.const";
import { BASE_BUFF_ITEM } from "../../const/miscs/buff/buff-item-base.const";
import { BuffType } from "../entities-props/buff.type";
import { EquipType } from "../entities-props/equip.type";

export type RawEquipItem = Omit<EquipType,keyof typeof BASE_EQUIP_ITEM>;

export type RawLegendaryEquipItem = Omit<EquipType,keyof typeof BASE_LEGENDARIO_ITEM>;

export type RawBuffItem = Omit<BuffType,keyof typeof BASE_BUFF_ITEM>;