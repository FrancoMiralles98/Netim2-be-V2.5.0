import { GenericType } from '../types/entities-props/item-base.type';
import { SpecificUtilityType, UtilityBaseType } from '../types/entities-props/utility-base.type';
import { ItemBase } from './item-base.entity';

export class UtilityBase extends ItemBase {
  protected readonly lvUtility: number;
  protected readonly description: string;
  protected readonly maxCantidad: number;
  protected readonly type_utility?: SpecificUtilityType;
  protected cantidad: number;
  protected type: GenericType;

  constructor(props: UtilityBaseType) {
    super(props);
    this.description = props.description;
    this.cantidad = props.cantidad ?? 1;
    this.maxCantidad = props.maxCantidad ?? 1;
    this.type = props.type;
    this.type_utility = props.type_utility ?? 'utility';
    this.lvUtility = props.lvUtility;
  }

  /**
   * Aumentar si es posible la cantidad de un objeto
   * @returns {number}
   *    - {0} : quiere decir que no dejo resto
   *    - {<0}: quiere decir que no pudo agregar toda la cantidad disponible
   */
  addQuantity(quantityToAdd: number): number {
    if (!this.acc) {
      throw new Error('Item can not acc');
    }
    const maxQuantityToAdd = this.maxCantidad - this.cantidad;
    if (maxQuantityToAdd <= quantityToAdd) {
      this.cantidad += quantityToAdd;
      return 0;
    } else {
      this.cantidad += maxQuantityToAdd;
      return quantityToAdd - maxQuantityToAdd;
    }
  }

  reduceQuantity(quantityToReduce: number): void {
    const newCantidad = this.cantidad - quantityToReduce;
    if (newCantidad < 0) {
      throw new Error('It was reduced more than what is currently available');
    }
    this.cantidad = newCantidad;
  }

  isPocionItem(): boolean {
    return this.type_utility === 'poción';
  }
}
