import { allFullNameBonusList, BonusInItem, BonusRefKeys } from 'netim2-shared';
import { GENERAL_CHARACTER_STATS } from '../../character/const/characterProps/base-character-stats.const';
import { LIMIT_BONUS_CONFIG } from '../config/limit-bonus.config';
import { LimitBonusService } from './limit-bonus.service';
import { MIN_BONUS_CONFIG } from '../config/min-bonus.config';

describe('LimitBonusService contribution caps', () => {
  const service = new LimitBonusService();
  const originalMinimums = { ...MIN_BONUS_CONFIG };
  afterEach(() => {
    for (const key of Object.keys(MIN_BONUS_CONFIG) as BonusRefKeys[])
      delete MIN_BONUS_CONFIG[key];
    Object.assign(MIN_BONUS_CONFIG, originalMinimums);
  });
  function modifier(
    value: number,
    operation: 'flat' | 'porcentage' = 'flat',
  ): BonusInItem {
    return {
      bonusFullName: allFullNameBonusList.MAX_HP,
      bonusRef: 'vh',
      bonusValue: value,
      category: { type: 'generic', tier: 1 },
      origin: 'random',
      effects: { type: 'stats_cap_modifier', target: 'vh', operation },
    };
  }

  it('keeps a base above the bonus cap and only limits the additional contribution', () => {
    const base = structuredClone(GENERAL_CHARACTER_STATS);
    base.general.vh = 360;
    const stats = structuredClone(base);
    stats.general.vh = 1000;
    expect(service.applyBonusLimitsToStats(stats, [], base).general.vh).toBe(
      660,
    );
    expect(service.applyBonusLimitsToStats(base, [], base).general.vh).toBe(
      360,
    );
  });

  it('preserves the base part of a bonus-group stat', () => {
    const base = structuredClone(GENERAL_CHARACTER_STATS);
    base.bonus.defensa.def_espada = 50;
    const stats = structuredClone(base);
    stats.bonus.defensa.def_espada = 200;
    expect(
      service.applyBonusLimitsToStats(stats, [], base).bonus.defensa.def_espada,
    ).toBe(120);
  });

  it('does not impose negative minimums on general or bonus stats', () => {
    const base = structuredClone(GENERAL_CHARACTER_STATS);
    base.general.vh = 360;
    const stats = structuredClone(base);
    stats.general.vh = -400;
    stats.bonus.defensa.def_espada = -100;
    const result = service.applyBonusLimitsToStats(stats, [], base);
    expect(result.general.vh).toBe(-400);
    expect(result.bonus.defensa.def_espada).toBe(-100);
  });

  it('applies zero and negative configured minima to final values, leaving absent keys unrestricted', () => {
    Object.assign(MIN_BONUS_CONFIG, { def: 0, vh: -30, def_espada: -10 });
    const base = structuredClone(GENERAL_CHARACTER_STATS);
    base.general.def = 100;
    const stats = structuredClone(base);
    stats.general.def = -20;
    stats.general.vh = -100;
    stats.general.vm = -1000;
    stats.bonus.defensa.def_espada = -50;
    const result = service.applyBonusLimitsToStats(stats, [], base);
    expect(result.general.def).toBe(0);
    expect(result.general.vh).toBe(-30);
    expect(result.general.vm).toBe(-1000);
    expect(result.bonus.defensa.def_espada).toBe(-10);
    expect(stats.general.def).toBe(-20);
  });

  it('applies range minima to both endpoints and resource minima only to the maximum', () => {
    Object.assign(MIN_BONUS_CONFIG, { ad: -10, ap: 0, hp: 100, mana: 50 });
    const stats = structuredClone(GENERAL_CHARACTER_STATS);
    stats.general.ad = { min: -50, max: 20 };
    stats.general.ap = { min: -30, max: -10 };
    stats.general.hp = { actual: 5, max: -10 };
    stats.general.mana = { actual: 2, max: -20 };
    const result = service.applyBonusLimitsToStats(stats);
    expect(result.general.ad).toEqual({ min: -10, max: 20 });
    expect(result.general.ap).toEqual({ min: 0, max: 0 });
    expect(result.general.hp).toEqual({ actual: 5, max: 100 });
    expect(result.general.mana).toEqual({ actual: 2, max: 50 });
  });

  it('leaves values above the minimum unchanged and rejects invalid minimum configuration', () => {
    MIN_BONUS_CONFIG.def = 0;
    const stats = structuredClone(GENERAL_CHARACTER_STATS);
    stats.general.def = 20;
    expect(service.applyBonusLimitsToStats(stats).general.def).toBe(20);
    MIN_BONUS_CONFIG.def = NaN;
    expect(() => service.applyBonusLimitsToStats(stats)).toThrow(
      'mínimo configurado',
    );
  });

  it('retains the old zero-base contract when the baseline is omitted', () => {
    const stats = structuredClone(GENERAL_CHARACTER_STATS);
    stats.general.vh = 1000;
    expect(service.applyBonusLimitsToStats(stats).general.vh).toBe(300);
  });

  it('applies accumulated cap modifiers once without mutating config or inputs', () => {
    const config = { ...LIMIT_BONUS_CONFIG };
    const base = structuredClone(GENERAL_CHARACTER_STATS);
    base.general.vh = 100;
    const stats = structuredClone(base);
    stats.general.vh = 1000;
    const bonuses = [
      modifier(-10),
      modifier(10, 'porcentage'),
      modifier(20, 'porcentage'),
    ];
    const original = structuredClone({ stats, base, bonuses });
    expect(
      service.applyBonusLimitsToStats(stats, bonuses, base).general.vh,
    ).toBeCloseTo(477);
    expect({ stats, base, bonuses }).toEqual(original);
    expect(LIMIT_BONUS_CONFIG).toEqual(config);
  });
});
