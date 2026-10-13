import { Injectable } from '@nestjs/common';
import { AppliedBuffos, Atributos, BonusInItem, Stats } from 'netim2-shared';
import { applyBonusModifiers } from './bonus-modifiers-calculator';

export interface BuffStatsResult {
  stats: Stats;
  atributos: Atributos;
}

@Injectable()
export class BuffStatsCalculatorService {
  applyBuffFlatBonuses(
    stats: Stats,
    atributos: Atributos,
    buffos: AppliedBuffos[],
  ): BuffStatsResult {
    return applyBonusModifiers(
      stats,
      atributos,
      this.getBonuses(buffos),
      'flat',
    );
  }

  applyBuffPercentageBonuses(
    stats: Stats,
    atributos: Atributos,
    buffos: AppliedBuffos[],
  ): BuffStatsResult {
    return applyBonusModifiers(
      stats,
      atributos,
      this.getBonuses(buffos),
      'porcentage',
    );
  }

  getBonuses(buffos: AppliedBuffos[]): BonusInItem[] {
    return buffos.flatMap((buff) => [
      ...(buff.implicitBonus ?? []),
      ...(buff.corruptBonus ?? []),
    ]);
  }
}
