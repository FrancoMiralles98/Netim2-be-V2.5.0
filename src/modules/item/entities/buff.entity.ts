import { BuffType, EffecDescription } from '../types/entities-props/buff.type';
import { UtilityBase } from './utility-base.entity';

export class Buff extends UtilityBase {
  protected readonly duration: number;
  protected readonly iconBuff: string;
  protected readonly idBUff: number;
  protected readonly effect: EffecDescription[];

  constructor(props: BuffType) {
    super(props);
    this.duration = props.duration;
    this.iconBuff = props.iconBuff;
    this.idBUff = props.idBuff;
    this.effect = props.effect;
  }
}
