import { CeboType } from 'netim2-shared';
import { UtilityBase } from './utility-base.entity';

export class Cebo extends UtilityBase {
  protected readonly pescaSkill: number;

  constructor(props: CeboType) {
    super(props);
    this.pescaSkill = props.pescaSkill;
  }
}
