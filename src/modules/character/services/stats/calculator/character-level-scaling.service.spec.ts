import { GENERAL_CHARACTER_STATS as BASE_CHARACTER_STATS } from '../../../const/characterProps/base-character-stats.const';
import { CharacterLevelScalingService } from './character-level-scaling.service';

describe('CharacterLevelScalingService', () => {
  const service = new CharacterLevelScalingService();
  const GENERAL_CHARACTER_STATS = structuredClone(BASE_CHARACTER_STATS);
  GENERAL_CHARACTER_STATS.general.ad = { min: 10, max: 10 };
  GENERAL_CHARACTER_STATS.general.ap = { min: 20, max: 20 };
  GENERAL_CHARACTER_STATS.general.hp = { actual: 500, max: 1000 };
  GENERAL_CHARACTER_STATS.general.mana = { actual: 100, max: 100 };
  GENERAL_CHARACTER_STATS.general.regen_hp = 5;
  GENERAL_CHARACTER_STATS.general.regen_mana = 10;

  it('adds only race base values at level one, preserving current HP and mana', () => {
    const result = service.applyLevelScaling(GENERAL_CHARACTER_STATS, 'guerrero', 1);
    expect(result.general.hp).toEqual({ actual: 500, max: 1950 });
    expect(result.general.mana).toEqual({ actual: 100, max: 350 });
    expect(result.general.ad).toEqual({ min: 18, max: 18 });
    expect(result.general.ap).toEqual({ min: 22, max: 22 });
    expect(result.general.regen_hp).toBe(17);
    expect(result.general.regen_mana).toBe(13);
  });

  it('adds base and ten level increments at level eleven without mutating input', () => {
    const base = structuredClone(GENERAL_CHARACTER_STATS);
    base.general.ad = { min: 10, max: 30 };
    base.general.ap = { min: 20, max: 50 };
    const original = structuredClone(base);
    const result = service.applyLevelScaling(base, 'guerrero', 11);
    expect(result.general.hp.max).toBe(2190);
    expect(result.general.mana.max).toBe(410);
    expect(result.general.ad).toEqual({ min: 42, max: 62 });
    expect(result.general.ap).toEqual({ min: 28, max: 58 });
    expect(result.general.regen_hp).toBeCloseTo(18.6);
    expect(result.general.regen_mana).toBeCloseTo(13.4);
    expect(result.general.def).toBe(base.general.def);
    expect(result.bonus).toEqual(base.bonus);
    expect(base).toEqual(original);
  });

  it('uses the selected race and preserves fractional growth', () => {
    const result = service.applyLevelScaling(GENERAL_CHARACTER_STATS, 'chaman', 2);
    expect(result.general.hp.max).toBe(1664);
    expect(result.general.mana.max).toBe(666);
    expect(result.general.ap.min).toBeCloseTo(30.4);
    expect(result.general.ad.min).toBeCloseTo(12.6);
    expect(result.general.regen_hp).toBeCloseTo(9.06);
    expect(result.general.regen_mana).toBeCloseTo(21.14);
  });

  it.each([0, -1, 1.5, NaN, Infinity])('rejects invalid character level %s', level => {
    expect(() => service.applyLevelScaling(GENERAL_CHARACTER_STATS, 'guerrero', level))
      .toThrow('El nivel del personaje debe ser un entero mayor o igual a 1');
  });
});
