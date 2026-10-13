import { BonusInItem, BonusTierLv } from 'netim2-shared';
import { BONUS_LIST } from '../const/bonus-list.cons';
import { BonusWeightService } from './bonus-weight.service';

describe('BonusWeightService', () => {
  const service = new BonusWeightService();

  function genericBonus(
    bonusRef: BonusInItem['bonusRef'],
    tier: BonusTierLv,
    bonusValue: BonusInItem['bonusValue'],
  ): BonusInItem {
    const definition = BONUS_LIST.find(
      bonus => bonus.bonus_ref_name === bonusRef &&
        bonus.category.type === 'generic' && bonus.category.tier === tier,
    )!;

    return {
      bonusFullName: definition.full_name,
      bonusRef,
      category: { type: 'generic', tier },
      bonusValue,
      effects: definition.effects,
      origin: 'random',
    };
  }

  it('returns zero for an empty list', () => {
    expect(service.getBonusWeight([])).toBe(0);
  });

  it.each<[BonusInItem['bonusRef'], BonusTierLv, number, number]>([
    ['orcos', 1, 20, 0.8],
    ['def_espada', 2, 10, 1.2],
    ['va', 3, 10, 3],
    ['media', 4, 60, 6],
  ])('returns the maximum weight for %s at tier %i', (ref, tier, value, weight) => {
    expect(service.getBonusWeight([genericBonus(ref, tier, value)])).toBeCloseTo(weight);
  });

  it('adds proportional weights using the generic range rather than another category', () => {
    expect(service.getBonusWeight([
      genericBonus('hp', 3, 1000),
      genericBonus('orcos', 1, 20),
    ])).toBeCloseTo(2.3);
  });

  it('allows a tier 3 bonus at 110 percent to weigh 3.3', () => {
    expect(service.getBonusWeight([genericBonus('va', 3, 11)])).toBeCloseTo(3.3);
  });

  it('ignores corrupt and bonus6_7 bonuses before inspecting their values', () => {
    const bonus = genericBonus('hp', 3, 2000);
    expect(service.getBonusWeight([
      bonus,
      { ...bonus, category: { type: 'corrupt', sub_type: 'none' }, bonusValue: { min: 1, max: 10 } },
      { ...bonus, category: { type: 'bonus6_7' }, bonusValue: 800 },
    ])).toBeCloseTo(3);
  });

  it('rejects a generic bonus without a definition for its tier', () => {
    const bonus = genericBonus('hp', 3, 2000);
    expect(() => service.getBonusWeight([
      { ...bonus, category: { type: 'generic', tier: 1 } },
    ])).toThrow('Bonus genérico no encontrado');
  });

  it('rejects generic bonuses with a range instead of a numeric value', () => {
    expect(() => service.getBonusWeight([
      genericBonus('va', 3, { min: 1, max: 10 }),
    ])).toThrow('El valor del bonus debe ser de tipo number');
  });
});
