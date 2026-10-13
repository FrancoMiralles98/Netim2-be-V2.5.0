import { BonusInItem, BuffType } from 'netim2-shared';
import { UtilityBase } from './utility-base.entity';

export class Buff extends UtilityBase {
  protected readonly duration: number;
  protected readonly idBUff: number;
  protected readonly implicitBonus: BonusInItem[];

  constructor(props: BuffType) {
    super(props);
    this.duration = props.duration;
    this.idBUff = props.idBuff;
    this.implicitBonus = props.implicitBonus;
  }
}
