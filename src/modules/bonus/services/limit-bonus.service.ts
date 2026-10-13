import { Injectable } from '@nestjs/common';
import { BonusInItem, BonusRefKeys, Stats } from 'netim2-shared';
import { LIMIT_BONUS_CONFIG } from '../config/limit-bonus.config';
import { MIN_BONUS_CONFIG } from '../config/min-bonus.config';
import { applyBonusValue } from '../../shared/utils/bonus-value-modifier';

@Injectable()
export class LimitBonusService {
  /**
   * Con baseStats limita solo el aporte de las bonificaciones: base + min(final - base, cap).
   * Sin baseStats conserva el contrato anterior (base cero).
   * MIN_BONUS_CONFIG limita el valor final; las claves ausentes no tienen mínimo.
   */
  applyBonusLimitsToStats(
    stats: Stats,
    bonuses: BonusInItem[] = [],
    baseStats?: Stats,
  ): Stats {
    const limits = this.getLimits(bonuses);
    const result = structuredClone(stats);
    for (const key of Object.keys(
      result.general,
    ) as (keyof Stats['general'])[]) {
      const value = result.general[key];
      if (typeof value !== 'number') continue;
      const base = baseStats?.general[key];
      (result.general as unknown as Record<string, number>)[key] =
        this.applyMinimum(
          this.limitContribution(
            value,
            typeof base === 'number' ? base : 0,
            limits[key as BonusRefKeys],
          ),
          key as BonusRefKeys,
        );
    }
    for (const group of Object.keys(result.bonus) as (keyof Stats['bonus'])[]) {
      const values = result.bonus[group] as Partial<
        Record<BonusRefKeys, number>
      >;
      const bases = baseStats?.bonus[group] as
        | Partial<Record<BonusRefKeys, number>>
        | undefined;
      for (const ref of Object.keys(values) as BonusRefKeys[]) {
        values[ref] = this.applyMinimum(
          this.limitContribution(values[ref]!, bases?.[ref] ?? 0, limits[ref]),
          ref,
        );
      }
    }
    for (const ref of ['ad', 'ap'] as const) {
      result.general[ref].min = this.applyMinimum(result.general[ref].min, ref);
      result.general[ref].max = this.applyMinimum(result.general[ref].max, ref);
    }
    for (const ref of ['hp', 'mana'] as const) {
      result.general[ref].max = this.applyMinimum(result.general[ref].max, ref);
    }
    return result;
  }

  private applyMinimum(value: number, ref: BonusRefKeys): number {
    const minimum = MIN_BONUS_CONFIG[ref];
    if (minimum === undefined) return value;
    if (!Number.isFinite(minimum)) {
      throw new Error(`El mínimo configurado para ${ref} debe ser finito`);
    }
    return Math.max(value, minimum);
  }

  private limitContribution(
    value: number,
    base: number,
    limit?: number,
  ): number {
    if (!Number.isFinite(value) || !Number.isFinite(base)) {
      throw new Error('El cálculo de límites requiere valores finitos');
    }
    return limit === undefined ? value : base + Math.min(value - base, limit);
  }

  private getLimits(bonuses: BonusInItem[]): typeof LIMIT_BONUS_CONFIG {
    const limits = { ...LIMIT_BONUS_CONFIG };
    const flat = new Map<BonusRefKeys, number>();
    const percentage = new Map<BonusRefKeys, number>();
    for (const bonus of bonuses) {
      const effect = bonus.effects;
      if (effect.type !== 'stats_cap_modifier') continue;
      if (
        typeof bonus.bonusValue !== 'number' ||
        !Number.isFinite(bonus.bonusValue)
      ) {
        throw new Error('El modificador de límite debe ser numérico y finito');
      }
      const totals = effect.operation === 'flat' ? flat : percentage;
      totals.set(
        effect.target,
        (totals.get(effect.target) ?? 0) + bonus.bonusValue,
      );
    }
    for (const ref of Object.keys(limits) as BonusRefKeys[]) {
      const subtotal = applyBonusValue(
        limits[ref]!,
        flat.get(ref) ?? 0,
        'flat',
      );
      limits[ref] = Math.max(
        0,
        applyBonusValue(subtotal, percentage.get(ref) ?? 0, 'porcentage'),
      );
    }
    return limits;
  }
}
