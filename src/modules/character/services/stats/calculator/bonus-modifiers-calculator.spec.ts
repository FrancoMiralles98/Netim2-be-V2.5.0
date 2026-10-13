import { Atributos, allFullNameBonusList, BonusInItem } from 'netim2-shared';
import { GENERAL_CHARACTER_STATS } from '../../../const/characterProps/base-character-stats.const';
import { applyBonusModifiers } from './bonus-modifiers-calculator';

describe('applyBonusModifiers signed percentages', () => {
  function attributes(): Atributos {
    return {
      STR: { lvPoints: 0, bonusPoints: 0 },
      INT: { lvPoints: 0, bonusPoints: 0 },
      DEX: { lvPoints: 0, bonusPoints: 0 },
      VIT: { lvPoints: 0, bonusPoints: 0 },
    };
  }
  function bonus(value: number, operation: 'flat' | 'porcentage'): BonusInItem {
    return {
      bonusValue: value,
      bonusFullName: allFullNameBonusList.MAX_HP,
      bonusRef: 'def',
      category: { type: 'generic', tier: 1 },
      origin: 'random',
      effects: { type: 'stat_modifiers', target: ['general.def'], operation },
    };
  }

  it.each([
    [100, 30, -10, 20, -5, 138],
    [-100, 0, 0, 20, 0, -80],
    [-100, 0, 0, 0, -20, -120],
    [-100, 0, 0, 20, -5, -85],
    [10, 0, -25, 20, 0, -12],
    [100, 0, -100, 90, -5, 0],
    [-100, 300, 0, 20, 0, 240],
    [100, 0, -300, 20, 0, -160],
  ])(
    'base %i, flats %i/%i, percentages %i/%i yield %i',
    (base, positive, negative, increased, reduced, expected) => {
      const stats = structuredClone(GENERAL_CHARACTER_STATS);
      stats.general.def = base;
      const modifiers = [
        bonus(positive, 'flat'),
        bonus(negative, 'flat'),
        bonus(increased, 'porcentage'),
        bonus(reduced, 'porcentage'),
      ];
      const flat = applyBonusModifiers(stats, attributes(), modifiers, 'flat');
      const result = applyBonusModifiers(
        flat.stats,
        flat.atributos,
        modifiers,
        'porcentage',
      );
      expect(result.stats.general.def).toBeCloseTo(expected);
      expect(stats.general.def).toBe(base);
    },
  );

  it('uses the same numeric semantics for negative attributes and AD/AP endpoints', () => {
    const stats = structuredClone(GENERAL_CHARACTER_STATS);
    stats.general.ad = { min: -100, max: -50 };
    const attrs = attributes();
    attrs.STR = { lvPoints: -10, bonusPoints: -5 };
    const attr: BonusInItem = {
      ...bonus(20, 'porcentage'),
      effects: {
        type: 'attribute_modifier',
        operation: 'porcentage',
        target: 'atribute.STR.bonusPoints',
      },
    };
    const ad: BonusInItem = {
      ...bonus(20, 'porcentage'),
      effects: {
        type: 'stat_modifiers',
        operation: 'porcentage',
        target: ['general.ad'],
      },
    };
    const result = applyBonusModifiers(
      stats,
      attrs,
      [attr, ad],
      'porcentage',
      'all',
      'total',
    );
    expect(result.stats.general.ad).toEqual({ min: -80, max: -40 });
    expect(result.atributos.STR).toEqual({ lvPoints: -10, bonusPoints: -2 });
  });

  it('rejects overflow instead of returning Infinity or NaN', () => {
    const stats = structuredClone(GENERAL_CHARACTER_STATS);
    stats.general.def = Number.MAX_VALUE;
    expect(() =>
      applyBonusModifiers(
        stats,
        attributes(),
        [bonus(Number.MAX_VALUE, 'flat')],
        'flat',
      ),
    ).toThrow('finito');
  });
});
