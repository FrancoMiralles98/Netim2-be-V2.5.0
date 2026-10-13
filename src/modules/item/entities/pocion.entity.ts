
import { PotionEffect, PocionType } from 'netim2-shared';
import { UtilityBase } from './utility-base.entity';

export class Pocion extends UtilityBase {
  protected readonly effect: PotionEffect[];

  constructor(props: PocionType) {
    super(props);
    this.effect = props.effect;
  }
}
