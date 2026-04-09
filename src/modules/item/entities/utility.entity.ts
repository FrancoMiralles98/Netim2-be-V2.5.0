import { UtilityType } from '../types/entities-props/utility.type';
import { UtilityBase } from './utility-base.entity';

export class Utility extends UtilityBase {
  constructor(props: UtilityType) {
    super(props);
  }
}
