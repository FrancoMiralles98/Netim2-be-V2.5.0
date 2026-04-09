import { ItemBaseType } from "./item-base.type";


export interface UtilityBaseType extends ItemBaseType {
  description: string;
  cantidad: number;
  type: 'utility';
  maxCantidad: number;
  type_utility: SpecificUtilityType;
  lvUtility: number;
  containsItem: boolean;
  itemIfContain: ItemIfContainType[];
}

export type SpecificUtilityType =
  | 'piedra'
  | 'buff'
  | 'montura'
  | 'utility'
  | 'cebo'
  | 'caña'
  | 'poción';

export type RewardTypes = 'exp' | 'yang' | 'mds' | 'item';

export interface ItemIfContainType {
  rewardType: RewardTypes; //a que tipo se refiere, exp yang mds items etc
  valueReward: number; //el valor del reward, si es exp el valor de la exp, si es un item: el idItem correspondiente
  chances: number; //la probabilidad de que salga el el reward, el total de todos los items las chances tiene que dar 100 o cercanos al 100
  rewardOptions?: ChestRewardOptions;
}

export interface ChestRewardOptions {
  cantidadChances?: [number, number]; //si es un item que tiene cantidad se puede seleccionar una cantidad maxima y minima que pueda salir
  upgradeChances?: [number, number]; //si es un item que tiene niveles de mejora,se puede seleccionar un rango de mejoras en las que puede salir
}
