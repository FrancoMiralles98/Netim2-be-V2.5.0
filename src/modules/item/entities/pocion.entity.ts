
import { PotionEffect, PocionType, PotionReserve, ReservePotion } from 'netim2-shared';
import { UtilityBase } from './utility-base.entity';

export class Pocion extends UtilityBase {
  protected readonly effect?: PotionEffect[];
  protected readonly potionType: PocionType['potionType'];
  protected readonly resource?: ReservePotion['resource'];
  protected reserve?: PotionReserve;

  constructor(props: PocionType) {
    super(props);
    this.potionType = props.potionType;
    if (props.potionType === 'reserve') {
      this.resource = structuredClone(props.resource);
      this.reserve = structuredClone(props.reserve);
    } else {
      this.effect = structuredClone(props.effect);
    }
  }
}
