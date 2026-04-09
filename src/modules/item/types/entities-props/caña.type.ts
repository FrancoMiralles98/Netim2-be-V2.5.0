import { UtilityBaseType } from "./utility-base.type";

export interface CañaType extends UtilityBaseType {
  type_utility: 'caña';
  exp: number;
  expOfLv: number;
  pescaSkill: number;
  upgradeLv: number;
  upgradeMax: number;
  special: boolean;
}
