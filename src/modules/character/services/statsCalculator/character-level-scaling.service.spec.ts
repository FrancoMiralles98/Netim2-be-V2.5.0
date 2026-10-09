import { GENERAL_CHARACTER_STATS } from '../../const/characterProps/base-character-stats.const';
import { CharacterLevelScalingService } from './character-level-scaling.service';

describe('CharacterLevelScalingService', () => {
  const service = new CharacterLevelScalingService();

  it('adds only race base values at level one, preserving current HP and mana', () => {
    const result = service.applyLevelScaling(GENERAL_CHARACTER_STATS, 'guerrero', 1);
    expect(result.general.hp).toEqual({ actual: 500, max: 1900 });
    expect(result.general.mana).toEqual({ actual: 100, max: 350 });
    expect(result.general.ad).toEqual({ min: 22, max: 22 });
    expect(result.general.ap).toEqual({ min: 25, max: 25 });
    expect(result.general.regen_hp).toBe(13);
    expect(result.general.regen_mana).toBe(13);
  });

  it('adds base and ten level increments at level eleven without mutating input', () => {
    const base = structuredClone(GENERAL_CHARACTER_STATS);
    base.general.ad = { min: 10, max: 30 };
    base.general.ap = { min: 20, max: 50 };
    const original = structuredClone(base);
    const result = service.applyLevelScaling(base, 'guerrero', 11);
    expect(result.general.hp.max).toBe(2160);
    expect(result.general.mana.max).toBe(400);
    expect(result.general.ad).toEqual({ min: 42, max: 62 });
    expect(result.general.ap).toEqual({ min: 35, max: 65 });
    expect(result.general.regen_hp).toBeCloseTo(14);
    expect(result.general.regen_mana).toBeCloseTo(13.4);
    expect(result.general.def).toBe(base.general.def);
    expect(result.bonus).toEqual(base.bonus);
    expect(base).toEqual(original);
  });

  it('uses the selected race and preserves fractional growth', () => {
    const result = service.applyLevelScaling(GENERAL_CHARACTER_STATS, 'chaman', 2);
    expect(result.general.hp.max).toBe(1666);
    expect(result.general.mana.max).toBe(716);
    expect(result.general.ap.min).toBeCloseTo(35.2);
    expect(result.general.ad.min).toBeCloseTo(15.8);
    expect(result.general.regen_hp).toBeCloseTo(9.06);
    expect(result.general.regen_mana).toBeCloseTo(20.14);
  });

  it.each([0, -1, 1.5, NaN, Infinity])('rejects invalid character level %s', level => {
    expect(() => service.applyLevelScaling(GENERAL_CHARACTER_STATS, 'guerrero', level))
      .toThrow('El nivel del personaje debe ser un entero mayor o igual a 1');
  });
});
