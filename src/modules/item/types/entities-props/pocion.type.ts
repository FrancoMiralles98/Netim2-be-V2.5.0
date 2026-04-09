import { UtilityBaseType } from "./utility-base.type";


export interface PocionType extends UtilityBaseType {
  effect: [number, string];
  type_utility: 'poción';
}
