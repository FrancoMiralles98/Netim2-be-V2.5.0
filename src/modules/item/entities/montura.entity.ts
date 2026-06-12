
import { BonusInItem } from 'src/modules/bonus/types/bonus-in-item.type';
import {
  MonturaDescription,
  MonturaType,
} from '../types/entities-props/montura.type';
import { UtilityBase } from './utility-base.entity';
import { MONUTRA_RULES } from '../config/items-rule.const';

export class Montura extends UtilityBase {
  protected monturaLv: number;
  protected readonly montura: MonturaDescription;
  protected readonly special_montura: boolean;

  constructor(props: MonturaType) {
    super(props);
    this.monturaLv = props.monturaLv;
    this.montura = props.montura;
    this.special_montura = props.special_montura ?? false;
  }

  isSpecialMontura(): boolean {
    return this.special_montura;
  }

  /**
   * @recordatorio - cada punto de hp de la montura equivale a 1 hora en la vida real
   */
  getCurrentMonturaHp(): number {
    const now = Date.now();
    const hoursPassed = Math.floor(
      (now - this.montura.lastUpdate) / (1000 * 60 * 60), // lo transformamos a hora
    );
    return Math.max(0, this.montura.hp - hoursPassed);
  }

  isMonturaMaxLv(): boolean {
    return this.montura.lv === this.montura.maxLv;
  }

  addExptoMontura(exp: number, nextExpLv: number): void {
    if (this.isMonturaMaxLv()) {
      throw new Error('Montura is max lv');
    }
    this.montura.exp = exp;
    this.montura.nextExpLv = nextExpLv;
  }

  lvUpMontura(upgradeImplicitBonus: BonusInItem[]): void {
    if (this.isMonturaMaxLv()) {
      throw new Error('Montura is max lv');
    }
    this.montura.lv += 1;
    this.montura.implicitBonus = upgradeImplicitBonus;
  }

  isMonturaDead(): boolean {
    return this.getCurrentMonturaHp() === 0;
  }

  reviveMontura(): void {
    this.montura.lastUpdate = Date.now();
  }

  feedMontura(): void {
    if (this.isMonturaDead()) {
      throw new Error('mount is dead');
    }

    if (this.isSpecialMontura()) {
      throw new Error('Cant feed a special mount');
    }
    let newHp =
      this.getCurrentMonturaHp() +
      this.montura.maxHp * MONUTRA_RULES.HEALING_PER_ITEM;

    if (newHp > this.montura.maxHp) newHp = this.montura.maxHp;

    /**
     * @description - se le actualiza la ultima actualizacion ya la vida del caballo se determina por el tiempo transcurrido
     */
    const hoursToAdd = newHp - this.getCurrentMonturaHp();
    this.montura.lastUpdate +=
      hoursToAdd === 0
        ? Date.now()
        : this.montura.lastUpdate + hoursToAdd * 60 * 60 * 1000;
  }
}
