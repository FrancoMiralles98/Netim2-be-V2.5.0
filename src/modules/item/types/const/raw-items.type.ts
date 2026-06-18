import { BASE_EQUIP_ITEM } from "../../const/equip/base-equip.const";
import { BASE_LEGENDARIO_ITEM } from "../../const/equip/legendarios/base-legendario-item.const";
import { BASE_BUFF_ITEM } from "../../const/miscs/buff/buff-item-base.const";
import { BASE_CHEST_ITEM } from "../../const/miscs/chest/base-chest-item.const";
import { BASE_GENERIC_UTILITY } from "../../const/miscs/generic-utility-base.const";
import { LICENCIA_MONTURA_BASE_ITEM } from "../../const/miscs/montura/montura-base-item.const";
import { BASE_PIEDRA_ITEM } from "../../const/miscs/piedra/piedra-item-base.const";
import { POCION_BASE_ITEM } from "../../const/miscs/pocion/pocion-base.const";
import { BuffType } from "../entities-props/buff.type";
import { ChestType } from "../entities-props/chest.type";
import { EquipType } from "../entities-props/equip.type";
import { MonturaType } from "../entities-props/montura.type";
import { PiedraType } from "../entities-props/piedra.type";
import { PocionType } from "../entities-props/pocion.type";
import { UtilityType } from "../entities-props/utility.type";

export type RawEquipItem = Omit<EquipType,keyof typeof BASE_EQUIP_ITEM>;

export type RawLegendaryEquipItem = Omit<EquipType,keyof typeof BASE_LEGENDARIO_ITEM>;

export type RawBuffItem = Omit<BuffType,keyof typeof BASE_BUFF_ITEM>;

export type RawPiedraItem = Omit<PiedraType,keyof typeof BASE_PIEDRA_ITEM>;

export type RawGenericUtilityItem = Omit<UtilityType,keyof typeof BASE_GENERIC_UTILITY>;

export type RawChestItem = Omit<ChestType,keyof typeof BASE_CHEST_ITEM>;

export type RawPocionItem = Omit<PocionType,keyof typeof POCION_BASE_ITEM>;

export type RawMonturaItem = Omit<MonturaType,keyof typeof LICENCIA_MONTURA_BASE_ITEM>;