import { ItemBaseType } from "./item-base.type";


export interface UtilityBaseType extends ItemBaseType {
  description: string;
  cantidad: number;
  type: 'utility';
  maxCantidad: number;
  type_utility: SpecificUtilityType;
  lvUtility: number;
}

export type SpecificUtilityType =
  | 'piedra'
  | 'buff'
  | 'montura'
  | 'utility'
  | 'cebo'
  | 'caña'
  | 'poción'
  | 'chest'

export type RewardTypes = 'exp' | 'yang' | 'mds' | 'item';
