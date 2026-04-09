
import { BonusInItem, SpecialCorruptBonus } from 'src/modules/bonus/types/bonus-in-item.type';
import {
  EquipType,
  subTypeEquip,
  TypeWeapon,
} from '../types/entities-props/equip.type';
import { GenericType } from '../types/entities-props/item-base.type';
import { PiedrasOfItem } from '../types/entities-props/piedra.type';
import { ItemBase } from './item-base.entity';
import { EQUIP_RULES, PIEDRA_ROTA } from '../const/item-const';

export class Equip extends ItemBase {
  protected readonly lvReq: number;
  protected readonly upgradeMax: number;
  protected readonly legendary: boolean;
  protected readonly itemsForge: [];
  protected readonly restricted: string[];
  protected readonly especial: boolean;
  protected readonly type_weapon?: TypeWeapon;
  protected readonly type: GenericType;
  protected readonly sub_type_equip: subTypeEquip;

  protected piedras: PiedrasOfItem[];
  protected bonus6_7?: BonusInItem;
  protected corruptExplicitBonus?: BonusInItem;
  protected corruptImplicitBonus?: BonusInItem;
  protected corruptSpecialBonus?: SpecialCorruptBonus[];

  protected explicitBonus?: BonusInItem;
  protected implicitBonus: BonusInItem;
  protected priceForge: number;
  protected slot: number;
  protected weight: number;
  protected upgradeLv: number;

  constructor(props: EquipType) {
    super(props);
    this.lvReq = props.lvReq;

    this.upgradeLv = props.upgradeLv;
    this.upgradeMax = props.upgradeMax;

    this.type_weapon = props.type_weapon;
    this.restricted = props.restricted;
    this.weight = props.weight;
    this.type = props.type;
    this.sub_type_equip = props.sub_type_equip;

    this.especial = props.especial;
    this.legendary = props.legendary ?? false;

    this.implicitBonus = props.implicitBonus;
    this.explicitBonus = props.explicitBonus;

    this.piedras = props.piedras;

    this.slot = props.slot;
    this.bonus6_7 = props.bonus6_7;

    this.corruptExplicitBonus = props.corruptExplicitBonus;
    this.corruptImplicitBonus = props.corruptImplicitBonus;
    this.corruptSpecialBonus = props.corruptSpecialBonus;
  }

  isSpecialItem(): boolean {
    return this.especial;
  }

  isLegendaryItem(): boolean {
    return this.legendary;
  }

  applyUpgrade(implicitBonus: BonusInItem): void {
    if (!this.canUpgrade()) {
      throw new Error('The item is already at the max level');
    }
    this.upgradeLv++;
    this.implicitBonus = implicitBonus;
  }

  applyReduceUpgrade(implicitBonus: BonusInItem): void {
    if (this.canReduceUpgrade()) {
      throw new Error('The item cannot be reduced further');
    }
    this.upgradeLv--;
    this.implicitBonus = implicitBonus;
  }

  changeWeightBonus(valor: number): void {
    if (valor < 0) {
      throw new Error('The number cannot be negative.');
    }
    this.weight = valor;
  }

  insertStone(stone: PiedrasOfItem): void {
    if (!this.canInsertStone()) {
      throw new Error('The item does not have enough space');
    }
    this.piedras.push(stone);
  }

  removeLastStone(): PiedrasOfItem {
    if (this.piedras.length < 1) {
      throw new Error('there are no stones');
    }
    return this.piedras.pop()!;
  }

  cleanBrokenStones(): void {
    this.piedras = this.piedras.filter(
      (piedra) => piedra[0] !== PIEDRA_ROTA.idItem,
    );
  }

  canUpgrade(): boolean {
    return this.upgradeLv < this.upgradeMax;
  }

  canReduceUpgrade(): boolean {
    return this.upgradeLv > 0;
  }

  canInsertStone(): boolean {
    return this.supportsStone() && this.hasFreeStoneSlot();
  }

  corruptItem(): void {
    if (this.isCorrupted()) {
      throw new Error('Item is already corrupted');
    }
    this.corrupt = true;
  }

  insert6_7Bonus(bonus: BonusInItem) {
    if (Object.keys(bonus).length > EQUIP_RULES.MAX_6_7_BONUS) {
      throw new Error(
        `the Max number of bonus is ${EQUIP_RULES.MAX_6_7_BONUS}`,
      );
    }
    this.bonus6_7 = bonus;
  }

  insertExplicitBonus(bonus: BonusInItem): void {
    if (Object.keys(bonus).length > EQUIP_RULES.MAX_EXPLICIT_BONUS) {
      throw new Error(
        `the Max number of bonus is ${EQUIP_RULES.MAX_EXPLICIT_BONUS}`,
      );
    }
    if (this.isLegendaryItem()) {
      throw new Error('cannot change explicit bonuses on a legendary item.');
    }
    this.explicitBonus = bonus;
  }

  insertImplicitCorruptBonus(bonus: BonusInItem): void {
    if (!this.isCorrupted()) {
      throw new Error('Item not corrupted');
    }
    this.corruptImplicitBonus = bonus;
  }

  insertCorruptExplicitBonus(bonus: BonusInItem): void {
    if (!this.isCorrupted()) {
      throw new Error('Item not corrupted');
    }
    if (Object.keys(bonus).length > EQUIP_RULES.MAX_CORRUPT_EXPLICIT_BONUS) {
      throw new Error(
        `the Max number of bonus is ${EQUIP_RULES.MAX_CORRUPT_EXPLICIT_BONUS}`,
      );
    }
    this.corruptExplicitBonus = bonus;
  }

  insertSpecialCorruptBonus(bonus: SpecialCorruptBonus[]): void {
    if (!this.isCorrupted()) {
      throw new Error('Item not corrupted');
    }
    this.corruptSpecialBonus = bonus;
  }

  isWeaponItem(): boolean {
    return this.type_weapon !== undefined && this.sub_type_equip === 'arma';
  }

  private hasFreeStoneSlot(): boolean {
    return this.piedras.length < this.slot;
  }
  private supportsStone(): boolean {
    return this.sub_type_equip === 'arma' || this.sub_type_equip === 'armadura';
  }
}
