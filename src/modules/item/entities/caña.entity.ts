import { CañaType } from '../types/entities-props/caña.type';
import { UtilityBase } from './utility-base.entity';

export class Caña extends UtilityBase {
  protected exp: number;
  protected expOfLv: number;
  protected pescaSkill: number;
  protected upgradeLv: number;
  protected readonly upgradeMax: number;
  protected readonly special: boolean;

  constructor(props: CañaType) {
    super(props);
    this.exp = props.exp;
    this.expOfLv = props.expOfLv;
    this.pescaSkill = props.pescaSkill;
    this.upgradeLv = props.exp;
    this.upgradeMax = props.upgradeMax;
    this.special = props.special ?? false;
  }

  isCañaMaxLv(): boolean {
    return this.upgradeLv === this.upgradeMax;
  }

  isSpecialCaña(): boolean {
    return this.special;
  }

  lvUpCaña(pescaSkill: number, exp: number, expOfLv: number): void {
    if (this.isCañaMaxLv()) {
      throw new Error('Caña is max lv');
    }
    if (this.exp < this.expOfLv) {
      throw new Error('You dont have enough experience to level up');
    }
    this.upgradeLv += 1;
    this.pescaSkill = pescaSkill;
    this.exp = exp;
    this.expOfLv = expOfLv;
  }

  addExp(exp: number): void {
    if (this.isCañaMaxLv()) {
      throw new Error('Caña is max lv');
    }
    this.exp += exp;
  }
}
