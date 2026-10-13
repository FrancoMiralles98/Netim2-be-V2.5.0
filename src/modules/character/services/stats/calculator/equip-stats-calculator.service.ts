import { Injectable } from '@nestjs/common';
import { Atributos, BonusInItem, EquipType, Stats } from 'netim2-shared';
import { collectEquipmentBonuses } from './equipment-bonuses';
import { applyBonusModifiers } from './bonus-modifiers-calculator';

export interface EquipmentStatsResult {
  stats: Stats;
  atributos: Atributos;
}

@Injectable()
export class EquipStatsCalculatorService {
  applyEquipmentFlatBonuses(
    stats: Stats,
    atributos: Atributos,
    equip: EquipType[],
  ): EquipmentStatsResult {
    return applyBonusModifiers(
      stats,
      atributos,
      this.getBonuses(equip),
      'flat',
    );
  }

  applyEquipmentPercentageBonuses(
    stats: Stats,
    atributos: Atributos,
    equip: EquipType[],
  ): EquipmentStatsResult {
    return applyBonusModifiers(
      stats,
      atributos,
      this.getBonuses(equip),
      'porcentage',
    );
  }

  /** Devuelve aportes del equipo y piedras, con corrupción ya multiplicada. */
  getBonuses(equip: EquipType[]): BonusInItem[] {
    return collectEquipmentBonuses(equip);
  }
}
