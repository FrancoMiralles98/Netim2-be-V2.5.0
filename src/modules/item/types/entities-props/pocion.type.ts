import { EffecDescription } from "./buff.type";
import { UtilityBaseType } from "./utility-base.type";


export interface PocionType extends UtilityBaseType {
  effect: EffecDescription[];
  type_utility: 'poción';
}
