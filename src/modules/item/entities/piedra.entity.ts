
import { BonusInItem, PiedraType, SpecialCorruptBonus } from 'netim2-shared';
import { UtilityBase } from './utility-base.entity';

export class Piedra extends UtilityBase {

  constructor(private props: PiedraType) {
    super(props);
  }

  isPiedraMaxLv(): boolean {
    return this.props.upgradeLv === this.props.upgradeMax;
  }

  applyUpgradePiedra(implicitBonus: BonusInItem[]): void {
    if (this.isPiedraMaxLv()) {
      throw new Error('Piedra is max lv');
    }
    this.props.upgradeLv += 1;
    this.props.implicitBonus = implicitBonus;
  }

  addSpecialCorruptBonus(bonus: SpecialCorruptBonus[]): void {
    if (this.props.specialCorruptBonus) {
      throw new Error('It already has a bonus inserted');
    }
    this.props.specialCorruptBonus = bonus;
  }
}
