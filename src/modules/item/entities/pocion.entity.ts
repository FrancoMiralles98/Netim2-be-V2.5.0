
import { EffecDescription, PocionType } from 'netim2-shared';
import { UtilityBase } from './utility-base.entity';

export class Pocion extends UtilityBase {
  protected readonly effect: EffecDescription[];

  constructor(props: PocionType) {
    super(props);
    this.effect = props.effect;
  }
}
