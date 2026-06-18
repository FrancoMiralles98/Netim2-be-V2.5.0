import { BASE_EQUIP_ITEM } from "../const/equip/base-equip.const";
import { BASE_LEGENDARIO_ITEM } from "../const/equip/legendarios/base-legendario-item.const";
import { BASE_BUFF_ITEM } from "../const/miscs/buff/buff-item-base.const";
import { BASE_CHEST_ITEM } from "../const/miscs/chest/base-chest-item.const";
import { BASE_GENERIC_UTILITY } from "../const/miscs/generic-utility-base.const";
import { LICENCIA_MONTURA_BASE_ITEM } from "../const/miscs/montura/montura-base-item.const";
import { MONTURAS_LIST } from "../const/miscs/montura/montura-list.const";
import { BASE_PIEDRA_ITEM } from "../const/miscs/piedra/piedra-item-base.const";
import { POCION_BASE_ITEM } from "../const/miscs/pocion/pocion-base.const";
import { RawBuffItem, RawChestItem, RawEquipItem, RawGenericUtilityItem, RawLegendaryEquipItem, RawMonturaItem, RawPiedraItem, RawPocionItem } from "../types/const/raw-items.type";
import { BuffType } from "../types/entities-props/buff.type";
import { ChestType } from "../types/entities-props/chest.type";
import { EquipType } from "../types/entities-props/equip.type";
import { MonturaType } from "../types/entities-props/montura.type";
import { PiedraType } from "../types/entities-props/piedra.type";
import { PocionType } from "../types/entities-props/pocion.type";
import { UtilityType } from "../types/entities-props/utility.type";

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

export function createPiedraItem(data: RawPiedraItem): PiedraType {
    return {
        ...BASE_PIEDRA_ITEM,
        ...data,
    };
}

export function createGenericUtilityItem(data: RawGenericUtilityItem): UtilityType {
    return {
        ...BASE_GENERIC_UTILITY,
        ...data,
    };
}

export function createChestItem(data: RawChestItem): ChestType {
    return {
        ...BASE_CHEST_ITEM,
        ...data,
    };
}

export function createPocionItem(data: RawPocionItem): PocionType {
    return {
        ...POCION_BASE_ITEM,
        ...data,
    };
}

export function createMonturaItem(data: RawMonturaItem): MonturaType {
    const findMontura = MONTURAS_LIST.find(montura => montura.idItemRef === data.idItem)
    if (!findMontura) {
        throw new Error(`No se encuentra la referencia de la montura`)
    }
    return {
        ...LICENCIA_MONTURA_BASE_ITEM,
        ...data,
        montura: findMontura
    };
}