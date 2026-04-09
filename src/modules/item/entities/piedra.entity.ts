import { BonusInItem, SpecialCorruptBonus } from 'src/modules/bonus/types/bonus-in-item.type';
import { GenericType } from '../types/entities-props/item-base.type';
import { PiedraType } from '../types/entities-props/piedra.type';
import { UtilityBaseType } from '../types/entities-props/utility-base.type';
import { UtilityBase } from './utility-base.entity';

export class Piedra extends UtilityBase {
  protected implicitBonus: BonusInItem;
  protected upgradeLv: number;
  protected readonly upgradeMax: number;
  protected readonly restricted: GenericType[];
  protected priceForge: number[];
  protected itemsForge: UtilityBaseType[];
  protected specialCorruptBonus?: SpecialCorruptBonus;

  constructor(props: PiedraType) {
    super(props);
    this.implicitBonus = props.implicitBonus;
    this.upgradeLv = props.upgradeLv;
    this.upgradeMax = props.upgradeMax;
    this.priceForge = props.priceForge;
    this.itemsForge = props.itemsForge;
    this.specialCorruptBonus = props.specialCorruptBonus;
    this.restricted = props.restricted;
  }

  isPiedraMaxLv(): boolean {
    return this.upgradeLv === this.upgradeMax;
  }

  applyUpgradePiedra(implicitBonus: BonusInItem): void {
    if (this.isPiedraMaxLv()) {
      throw new Error('Piedra is max lv');
    }
    this.upgradeLv += 1;
    this.implicitBonus = implicitBonus;
  }

  addSpecialCorruptBonus(bonus: SpecialCorruptBonus): void {
    if (this.specialCorruptBonus) {
      throw new Error('It already has a bonus inserted');
    }
    this.specialCorruptBonus = bonus;
  }
}
