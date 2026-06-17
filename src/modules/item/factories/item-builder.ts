import { BASE_EQUIP_ITEM } from "../const/equip/base-equip.const";
import { BASE_LEGENDARIO_ITEM } from "../const/equip/legendarios/base-legendario-item.const";
import { BASE_BUFF_ITEM } from "../const/miscs/buff/buff-item-base.const";
import { RawBuffItem, RawEquipItem, RawLegendaryEquipItem } from "../types/const/raw-items.type";
import { BuffType } from "../types/entities-props/buff.type";
import { EquipType } from "../types/entities-props/equip.type";

export function createEquipItem(data: RawEquipItem): EquipType {
    return {
        ...BASE_EQUIP_ITEM,
        ...data,
    };
}

export function createLegendaryEquipItem(data: RawLegendaryEquipItem): EquipType {
    return {
        ...BASE_LEGENDARIO_ITEM,
        ...data,
    };
}

export function createBuffItem(data: RawBuffItem): BuffType {
    return {
        ...BASE_BUFF_ITEM,
        ...data,
    };
}