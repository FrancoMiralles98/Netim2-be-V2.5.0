import { allFullNameBonusList, Atributos, AttributesRefKeys, BonusCategory, BonusInItem, EquipType, ValueBonusType } from 'netim2-shared';
import { GENERAL_CHARACTER_STATS } from '../../const/characterProps/base-character-stats.const';
import { CharacterAttributesService } from './character-attributes.service';

describe('CharacterAttributesService', () => {
  const service = new CharacterAttributesService();

  function attributes(overrides: Partial<Atributos> = {}): Atributos {
    return {
      STR: { lvPoints: 0, bonusPoints: 0 },
      INT: { lvPoints: 0, bonusPoints: 0 },
      DEX: { lvPoints: 0, bonusPoints: 0 },
      VIT: { lvPoints: 0, bonusPoints: 0 },
      ...overrides,
    };
  }

  function capBonus(
    target: AttributesRefKeys, value: number, operation: ValueBonusType = 'flat',
    category: BonusCategory = { type: 'generic', tier: 1 },
  ): BonusInItem {
    return {
      bonusFullName: allFullNameBonusList.STR,
      bonusRef: target,
      category,
      bonusValue: value,
      effects: { type: 'attribute_cap_modifier', target, operation },
      origin: 'random',
    };
  }

  function item(props: Partial<EquipType> = {}): EquipType {
    return {
      implicitBonus: [], randomImplicitBonus: [], explicitBonus: [], bonus6_7: [],
      corruptExplicitBonus: [], corruptImplicitBonus: [], ...props,
    } as EquipType;
  }

  it('assigns race starting points while preserving bonuses and the input', () => {
    const attrs = attributes({
      STR: { lvPoints: 90, bonusPoints: 10 },
      INT: { lvPoints: 70, bonusPoints: -2 },
    });
    const original = structuredClone(attrs);
    const result = service.applyBaseAttributes(attrs, 'guerrero');
    expect(result).toEqual({
      STR: { lvPoints: 6, bonusPoints: 10 },
      INT: { lvPoints: 2, bonusPoints: -2 },
      DEX: { lvPoints: 3, bonusPoints: 0 },
      VIT: { lvPoints: 5, bonusPoints: 0 },
    });
    expect(attrs).toEqual(original);
    expect(service.applyBaseAttributes(result, 'guerrero')).toEqual(result);
  });

  it('uses the selected race with independent STR and DEX values', () => {
    const result = service.applyBaseAttributes(attributes(), 'ninja');
    expect(result.STR.lvPoints).toBe(4);
    expect(result.DEX.lvPoints).toBe(6);
    expect(result.INT.lvPoints).toBe(3);
    expect(result.VIT.lvPoints).toBe(3);
  });

  it('applies shared attribute effects, with percentage HP and flat AD/AP on both endpoints', () => {
    const attrs = attributes({
      STR: { lvPoints: 2, bonusPoints: 3 },
      DEX: { lvPoints: 4, bonusPoints: 0 },
      INT: { lvPoints: 1, bonusPoints: 1 },
      VIT: { lvPoints: 5, bonusPoints: 5 },
    });
    const result = service.applyAttributeBenefits(GENERAL_CHARACTER_STATS, attrs, [], 'guerrero');
    expect(result.stats.general.ad).toEqual({ min: 24, max: 24 });
    expect(result.stats.general.ap).toEqual({ min: 23, max: 23 });
    expect(result.stats.general.va).toBeCloseTo(51.2);
    expect(result.stats.general.vh).toBeCloseTo(0.6);
    expect(result.stats.general.hp.max).toBeCloseTo(1100);
    expect(result.stats.general.hp.actual).toBe(500);
    expect(result.atributos).toEqual(attrs);
  });

  it('uses race caps without changing either point field', () => {
    const attrs = attributes({ STR: { lvPoints: 50, bonusPoints: 30 } });
    expect(service.capAttributes(attrs, [], 'guerrero').STR).toBe(67);
    expect(service.capAttributes(attrs, [], 'chaman').STR).toBe(30);
    expect(attrs.STR).toEqual({ lvPoints: 50, bonusPoints: 30 });
  });

  it('uses speciality caps instead of race caps', () => {
    const attrs = attributes({ STR: { lvPoints: 50, bonusPoints: 80 } });
    expect(service.capAttributes(attrs, [], 'guerrero', 'Corporal').STR)
      .toBe(117);
  });

  it('accumulates cap increases and decreases, then applies summed percentages once', () => {
    const attrs = attributes({ STR: { lvPoints: 60, bonusPoints: 50 } });
    const equip = [
      item({ implicitBonus: [capBonus('STR', 5)], explicitBonus: [capBonus('STR', 10, 'porcentage')] }),
      item({ bonus6_7: [capBonus('STR', -2)], corruptImplicitBonus: [capBonus('STR', 20, 'porcentage')] }),
    ];
    // (67 + 5 - 2) * 1.30 = 91, lvPoints = 60.
    expect(service.capAttributes(attrs, equip, 'guerrero').STR).toBe(91);
  });

  it('reads cap modifiers from every BonusInItem array', () => {
    const attrs = attributes({ STR: { lvPoints: 60, bonusPoints: 40 } });
    const equip = [item({
      implicitBonus: [capBonus('STR', 2)], randomImplicitBonus: [capBonus('STR', 2)],
      explicitBonus: [capBonus('STR', 2)], bonus6_7: [capBonus('STR', 2)],
      corruptExplicitBonus: [capBonus('STR', 2)], corruptImplicitBonus: [capBonus('STR', 2)],
    })];
    expect(service.capAttributes(attrs, equip, 'guerrero').STR).toBe(79);
  });

  it('applies corruption accumulation to cap modifiers', () => {
    const attrs = attributes({ STR: { lvPoints: 60, bonusPoints: 40 } });
    const equip = [
      item({ corrupt: true, corruptImplicitBonus: [
        capBonus('STR', 5, 'flat', { type: 'corrupt', sub_type: 'corrupt_item_acc' }),
      ] }),
      item({ corrupt: true }), item({ corrupt: false }), item(),
    ];
    expect(service.capAttributes(attrs, equip, 'guerrero').STR).toBe(77);
  });

  it('supports percentage cap reductions', () => {
    const attrs = attributes({ STR: { lvPoints: 20, bonusPoints: 40 } });
    const equip = [item({ explicitBonus: [capBonus('STR', -50, 'porcentage')] })];
    expect(service.capAttributes(attrs, equip, 'guerrero').STR).toBe(33.5);
  });

  it('preserves lvPoints and uses only the lowered cap for benefits when lvPoints exceeds it', () => {
    const attrs = attributes({ STR: { lvPoints: 30, bonusPoints: 10 } });
    const equip = [item({ explicitBonus: [capBonus('STR', -50)] })];
    const result = service.applyAttributeBenefits(GENERAL_CHARACTER_STATS, attrs, equip, 'guerrero');
    expect(result.atributos.STR).toEqual({ lvPoints: 30, bonusPoints: 10 });
    expect(result.stats.general.ad).toEqual({ min: 44, max: 44 });
  });

  it('limits HP benefits to the race cap while preserving excess level points', () => {
    const attrs = attributes({ VIT: { lvPoints: 100, bonusPoints: 20 } });
    const result = service.applyAttributeBenefits(GENERAL_CHARACTER_STATS, attrs, [], 'guerrero');
    expect(result.atributos.VIT).toEqual({ lvPoints: 100, bonusPoints: 20 });
    expect(result.stats.general.hp.max).toBeCloseTo(1670);
    expect(attrs.VIT).toEqual({ lvPoints: 100, bonusPoints: 20 });
  });

  it('limits benefits while preserving excess bonusPoints', () => {
    const attrs = attributes({ VIT: { lvPoints: 60, bonusPoints: 40 } });
    const result = service.applyAttributeBenefits(GENERAL_CHARACTER_STATS, attrs, [], 'guerrero');
    expect(result.atributos.VIT).toEqual({ lvPoints: 60, bonusPoints: 40 });
    expect(result.stats.general.hp.max).toBeCloseTo(1670);
  });

  it('does not increase bonuses when attributes are already below their cap', () => {
    const attrs = attributes({ STR: { lvPoints: 5, bonusPoints: -2 } });
    expect(service.capAttributes(attrs, [], 'guerrero').STR).toBe(3);
    expect(attrs.STR).toEqual({ lvPoints: 5, bonusPoints: -2 });
  });

  it('ignores effects that do not modify attribute caps', () => {
    const unrelated = capBonus('STR', 100);
    unrelated.effects = { type: 'attribute_modifier', target: 'atribute.STR.bonusPoints', operation: 'flat' };
    const attrs = attributes({ STR: { lvPoints: 60, bonusPoints: 40 } });
    expect(service.capAttributes(attrs, [item({ explicitBonus: [unrelated] })], 'guerrero').STR).toBe(67);
  });

  it('returns modified stats and unchanged attributes without mutating any inputs', () => {
    const stats = structuredClone(GENERAL_CHARACTER_STATS);
    const attrs = attributes({ STR: { lvPoints: 60, bonusPoints: 40 } });
    const equip = [item({ explicitBonus: [capBonus('STR', 5)] })];
    const original = structuredClone({ stats, attrs, equip });
    const result = service.applyAttributeBenefits(stats, attrs, equip, 'guerrero');
    expect(result.stats).not.toBe(stats);
    expect(result.atributos).not.toBe(attrs);
    expect(result.atributos).toEqual(attrs);
    expect({ stats, attrs, equip }).toEqual(original);
  });
});
