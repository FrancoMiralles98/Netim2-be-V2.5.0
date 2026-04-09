import { UtilityBaseType } from "./utility-base.type";

/**
 * @description
 * @interface (CeboType) - hace referencia al los objetos que son cebos, los que
 * se utiliza para la pesca
 */
export interface CeboType extends UtilityBaseType {
  type_utility: 'cebo';
  pescaSkill: number;
}
