import { EffecDescription } from '../types/entities-props/buff.type';
import { PocionType } from '../types/entities-props/pocion.type';
import { UtilityBase } from './utility-base.entity';

export class Pocion extends UtilityBase {
  protected readonly effect: EffecDescription[];

  constructor(props: PocionType) {
    super(props);
    this.effect = props.effect;
  }
}
