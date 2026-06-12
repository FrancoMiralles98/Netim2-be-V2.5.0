import { BonusInItem, SpecialCorruptBonus } from 'src/modules/bonus/types/bonus-in-item.type';
import { EquipType, } from '../types/entities-props/equip.type';
import { PiedrasInItem } from '../types/entities-props/piedra.type';
import { ItemBase } from './item-base.entity';
import { EQUIP_RULES } from '../config/items-rule.const';
import { PiedraIdItem } from '../types/iditems/miscs/piedra-id-item.enum';

export class Equip extends ItemBase {

  constructor(private props: EquipType) {
    super(props);

  }

  get itemLv(): number {
    return this.props.itemLv
  }

  isSpecialItem(): boolean {
    return this.props.especial;
  }

  changeItemLv(itemLv: number): void {
    this.props.itemLv = Math.min(EQUIP_RULES.MAX__NORMAL_ITEM_LV,itemLv)
  }

  isLegendaryItem(): boolean {
    return this.props.legendary;
  }

  applyUpgrade(implicitBonus: BonusInItem[]): void {
    if (!this.canUpgrade()) {
      throw new Error('The item is already at the max level');
    }
    this.props.upgradeLv++;
    this.props.implicitBonus = implicitBonus;
  }

  applyReduceUpgrade(implicitBonus: BonusInItem[]): void {
    if (this.canReduceUpgrade()) {
      throw new Error('The item cannot be reduced further');
    }
    this.props.upgradeLv--;
    this.props.implicitBonus = implicitBonus;
  }

  changeWeightBonus(valor: number): void {
    if (valor < 0) {
      throw new Error('The number cannot be negative.');
    }
    this.props.weight = valor;
  }

  insertStone(stone: PiedrasInItem): void {
    if (!this.canInsertStone()) {
      throw new Error('The item does not have enough space');
    }
    this.props.piedras.push(stone);
  }

  removeLastStone(): PiedrasInItem {
    if (this.props.piedras.length < 1) {
      throw new Error('there are no stones');
    }
    return this.props.piedras.pop()!;
  }

  cleanBrokenStones(): void {
    this.props.piedras = this.props.piedras.filter(
      (piedra) => piedra[0] !== PiedraIdItem.PIEDRA_ROTA,
    );
  }

  canUpgrade(): boolean {
    return this.props.upgradeLv < this.props.upgradeMax;
  }

  canReduceUpgrade(): boolean {
    return this.props.upgradeLv > 0;
  }

  canInsertStone(): boolean {
    return this.supportsStone() && this.hasFreeStoneSlot();
  }

  corruptItem(): void {
    if (this.isCorrupted()) {
      throw new Error('Item is already corrupted');
    }
    this.props.corrupt = true;
  }

  insert6_7Bonus(bonus: BonusInItem[]) {
    if (Object.keys(bonus).length > EQUIP_RULES.MAX_6_7_BONUS) {
      throw new Error(
        `the Max number of bonus is ${EQUIP_RULES.MAX_6_7_BONUS}`,
      );
    }
    this.props.bonus6_7 = bonus;
  }

  insertExplicitBonus(bonus: BonusInItem[]): void {
    if (Object.keys(bonus).length > EQUIP_RULES.MAX_EXPLICIT_BONUS) {
      throw new Error(
        `the Max number of bonus is ${EQUIP_RULES.MAX_EXPLICIT_BONUS}`,
      );
    }
    if (this.isLegendaryItem()) {
      throw new Error('cannot change explicit bonuses on a legendary item.');
    }
    this.props.explicitBonus = bonus;
  }

  insertImplicitCorruptBonus(bonus: BonusInItem[]): void {
    if (!this.isCorrupted()) {
      throw new Error('Item not corrupted');
    }
    this.props.corruptImplicitBonus = bonus;
  }

  insertCorruptExplicitBonus(bonus: BonusInItem[]): void {
    if (!this.isCorrupted()) {
      throw new Error('Item not corrupted');
    }
    if (Object.keys(bonus).length > EQUIP_RULES.MAX_CORRUPT_EXPLICIT_BONUS) {
      throw new Error(
        `the Max number of bonus is ${EQUIP_RULES.MAX_CORRUPT_EXPLICIT_BONUS}`,
      );
    }
    this.props.corruptExplicitBonus = bonus;
  }

  insertSpecialCorruptBonus(bonus: SpecialCorruptBonus[]): void {
    if (!this.isCorrupted()) {
      throw new Error('Item not corrupted');
    }
    this.props.corruptSpecialBonus = bonus;
  }

  isWeaponItem(): boolean {
    return this.props.type_weapon !== undefined && this.props.sub_type_equip === 'arma';
  }

  private hasFreeStoneSlot(): boolean {
    return this.props.piedras.length < this.props.slot;
  }
  private supportsStone(): boolean {
    return this.props.sub_type_equip === 'arma' || this.props.sub_type_equip === 'armadura';
  }
}
