import { allFullNameBonusList, Atributos, BonusCategory, BonusInItem, EquipType, RoutStatKey, ValueBonusType } from 'netim2-shared';
import { GENERAL_CHARACTER_STATS } from '../../const/characterProps/base-character-stats.const';
import { EquipStatsCalculatorService } from './equip-stats-calculator.service';

describe('EquipStatsCalculatorService', () => {
  const service = new EquipStatsCalculatorService();
  const accumulating: BonusCategory = { type: 'corrupt', sub_type: 'corrupt_item_acc' };

  function stats() {
    const result = structuredClone(GENERAL_CHARACTER_STATS);
    result.general.ad = { min: 100, max: 200 };
    result.general.ap = { min: 50, max: 100 };
    result.general.def = 100;
    return result;
  }

  function attributes(): Atributos {
    return {
      STR: { lvPoints: 20, bonusPoints: 10 },
      INT: { lvPoints: 15, bonusPoints: 20 },
      DEX: { lvPoints: 10, bonusPoints: 0 },
      VIT: { lvPoints: 30, bonusPoints: 5 },
    };
  }

  function bonus(
    ref: BonusInItem['bonusRef'],
    target: RoutStatKey,
    value: BonusInItem['bonusValue'],
    operation: ValueBonusType = 'flat',
    category: BonusCategory = { type: 'generic', tier: 1 },
  ): BonusInItem {
    return {
      bonusFullName: allFullNameBonusList.MAX_HP,
      bonusRef: ref,
      category,
      effects: { type: 'stat_modifiers', target: [target], operation },
      bonusValue: value,
      origin: 'configured',
    };
  }

  function attributeBonus(value: number, operation: ValueBonusType = 'flat', category?: BonusCategory): BonusInItem {
    return {
      ...bonus('STR', 'general.def', value, operation, category),
      effects: { type: 'attribute_modifier', target: 'atribute.STR.bonusPoints', operation },
    };
  }

  function item(props: Partial<EquipType> = {}): EquipType {
    // Solo los campos leídos por el cálculo; identidad y datos visuales no intervienen.
    return {
      type: 'equip', sub_type_equip: 'arma',
      implicitBonus: [], randomImplicitBonus: [], explicitBonus: [],
      bonus6_7: [], corruptExplicitBonus: [], corruptImplicitBonus: [],
      corruptSpecialBonus: [], piedras: [],
      ...props,
    } as EquipType;
  }

  it('adds bonuses from all six equipment bonus arrays and ignores percentage effects in the flat pass', () => {
    const result = service.applyEquipmentFlatBonuses(stats(), attributes(), [item({
      implicitBonus: [bonus('def', 'general.def', 2)],
      randomImplicitBonus: [bonus('def', 'general.def', 3)],
      explicitBonus: [bonus('def', 'general.def', 4), bonus('def', 'general.def', 99, 'porcentage')],
      bonus6_7: [bonus('def', 'general.def', 5)],
      corruptExplicitBonus: [bonus('def', 'general.def', 6)],
      corruptImplicitBonus: [bonus('def', 'general.def', 7)],
    })]);
    expect(result.stats.general.def).toBe(127);
  });

  it('adds implicit weapon AD/AP ranges and scalar bonuses to both endpoints', () => {
    const result = service.applyEquipmentFlatBonuses(stats(), attributes(), [item({
      implicitBonus: [
        bonus('ad', 'general.ad', { min: 20, max: 40 }),
        bonus('ap', 'general.ap', { min: 10, max: 30 }),
      ],
      explicitBonus: [bonus('ad', 'general.ad', 5)],
      randomImplicitBonus: [bonus('ap', 'general.ap', 3)],
    })]);
    expect(result.stats.general.ad).toEqual({ min: 125, max: 245 });
    expect(result.stats.general.ap).toEqual({ min: 63, max: 133 });
  });

  it('adds attribute bonuses exclusively to bonusPoints', () => {
    const result = service.applyEquipmentFlatBonuses(stats(), attributes(), [
      item({ implicitBonus: [attributeBonus(2)] }),
      item({ bonus6_7: [attributeBonus(3)] }),
    ]);
    expect(result.atributos.STR).toEqual({ lvPoints: 20, bonusPoints: 15 });
    expect(result.atributos.INT).toEqual(attributes().INT);
  });

  it('multiplies corrupt_item_acc contributions by all five corrupted equipped items', () => {
    const equipped = Array.from({ length: 5 }, () => item({ corrupt: true }));
    equipped[0].corruptImplicitBonus = [
      bonus('def', 'general.def', 2, 'flat', accumulating),
      attributeBonus(2, 'flat', accumulating),
    ];
    const result = service.applyEquipmentFlatBonuses(stats(), attributes(), equipped);
    expect(result.stats.general.def).toBe(110);
    expect(result.atributos.STR.bonusPoints).toBe(20);
  });

  it('counts only corrupt === true, with no contribution when the count is zero', () => {
    const result = service.applyEquipmentFlatBonuses(stats(), attributes(), [
      item({ corrupt: false, corruptImplicitBonus: [bonus('def', 'general.def', 2, 'flat', accumulating)] }),
      item(),
    ]);
    expect(result.stats.general.def).toBe(100);
  });

  it('does not multiply ordinary bonuses or corrupt subtype none', () => {
    const result = service.applyEquipmentFlatBonuses(stats(), attributes(), [
      item({
        corrupt: true,
        explicitBonus: [bonus('def', 'general.def', 2)],
        corruptImplicitBonus: [bonus('def', 'general.def', 3, 'flat', { type: 'corrupt', sub_type: 'none' })],
      }),
      item({ corrupt: true }),
    ]);
    expect(result.stats.general.def).toBe(105);
  });

  it('sums 10 and 20 percent across items and arrays before applying, ignoring flat bonuses', () => {
    const result = service.applyEquipmentPercentageBonuses(stats(), attributes(), [
      item({ implicitBonus: [bonus('def', 'general.def', 10, 'porcentage')] }),
      item({ explicitBonus: [bonus('def', 'general.def', 20, 'porcentage'), bonus('def', 'general.def', 999)] }),
    ]);
    expect(result.stats.general.def).toBe(130);
  });

  it('combines overlapping targets even when bonus references differ', () => {
    const first = bonus('ad', 'general.ad', 10, 'porcentage');
    first.effects = { type: 'stat_modifiers', operation: 'porcentage', target: ['general.ad', 'general.ap'] };
    const result = service.applyEquipmentPercentageBonuses(stats(), attributes(), [
      item({ implicitBonus: [first] }),
      item({ explicitBonus: [bonus('ap', 'general.ap', 20, 'porcentage')] }),
    ]);
    expect(result.stats.general.ad.min).toBeCloseTo(110);
    expect(result.stats.general.ad.max).toBeCloseTo(220);
    expect(result.stats.general.ap).toEqual({ min: 65, max: 130 });
  });

  it('applies accumulated attribute percentages to bonusPoints without changing lvPoints', () => {
    const result = service.applyEquipmentPercentageBonuses(stats(), attributes(), [
      item({ implicitBonus: [attributeBonus(10, 'porcentage')] }),
      item({ explicitBonus: [attributeBonus(20, 'porcentage')] }),
    ]);
    expect(result.atributos.STR).toEqual({ lvPoints: 20, bonusPoints: 13 });
  });

  it('includes corruption multiplication before summing percentages', () => {
    const equipped = Array.from({ length: 5 }, () => item({ corrupt: true }));
    equipped[0].corruptImplicitBonus = [bonus('def', 'general.def', 2, 'porcentage', accumulating)];
    equipped[1].explicitBonus = [bonus('def', 'general.def', 20, 'porcentage')];
    const result = service.applyEquipmentPercentageBonuses(stats(), attributes(), equipped);
    expect(result.stats.general.def).toBe(130);
  });

  it('supports negative contributions without changing their sign', () => {
    const base = stats();
    base.bonus.daño.media = 50;
    const flat = service.applyEquipmentFlatBonuses(base, attributes(), [
      item({ explicitBonus: [bonus('media', 'bonus.daño.media', -10)] }),
    ]);
    expect(flat.stats.bonus.daño.media).toBe(40);
    const percent = service.applyEquipmentPercentageBonuses(base, attributes(), [
      item({ explicitBonus: [bonus('media', 'bonus.daño.media', -10, 'porcentage')] }),
    ]);
    expect(percent.stats.bonus.daño.media).toBe(45);
  });

  it('updates HP/mana maxima without changing current resources', () => {
    const flat = service.applyEquipmentFlatBonuses(stats(), attributes(), [
      item({ implicitBonus: [bonus('hp', 'general.hp', 100), bonus('mana', 'general.mana', 20)] }),
    ]);
    expect(flat.stats.general.hp).toEqual({ actual: 500, max: 1100 });
    expect(flat.stats.general.mana).toEqual({ actual: 100, max: 120 });
    const percent = service.applyEquipmentPercentageBonuses(flat.stats, flat.atributos, [
      item({ explicitBonus: [bonus('hp', 'general.hp', 10, 'porcentage')] }),
    ]);
    expect(percent.stats.general.hp.max).toBeCloseTo(1210);
    expect(percent.stats.general.hp.actual).toBe(500);
  });

  it('supports flat then percentage passes without mutating input stats, attributes, or equipment', () => {
    const base = stats();
    const attrs = attributes();
    const equipped = [item({
      explicitBonus: [
        bonus('def', 'general.def', 50),
        bonus('def', 'general.def', 10, 'porcentage'),
        bonus('def', 'general.def', 20, 'porcentage'),
      ],
    })];
    const original = structuredClone({ base, attrs, equipped });
    const flat = service.applyEquipmentFlatBonuses(base, attrs, equipped);
    const percent = service.applyEquipmentPercentageBonuses(flat.stats, flat.atributos, equipped);
    expect(percent.stats.general.def).toBe(195);
    expect(flat.stats.general.def).toBe(150);
    expect({ base, attrs, equipped }).toEqual(original);
  });

  it('ignores cap and conditional effects instead of applying them as direct stat bonuses', () => {
    const cap = bonus('def', 'general.def', 50);
    cap.effects = { type: 'stats_cap_modifier', target: 'def', operation: 'flat' };
    const conditional = bonus('def', 'general.def', 50);
    conditional.effects = { type: 'conditional_modifier', target: 'general.ad', operation: 'flat', conditions: [] };
    const result = service.applyEquipmentFlatBonuses(stats(), attributes(), [
      item({ explicitBonus: [cap, conditional] }),
    ]);
    expect(result.stats).toEqual(stats());
  });

  it('includes both stone bonus arrays in the flat pass, excluding percentage bonuses', () => {
    const equipped = [item({
      explicitBonus: [bonus('ad', 'general.ad', 5)],
      piedras: [{
        idItem: 1, name: 'Piedra', upgradeLv: 0,
        implicitBonus: [bonus('ad', 'general.ad', 10), attributeBonus(3)],
        corruptExplicitBonus: [bonus('ad', 'general.ad', 2), bonus('ad', 'general.ad', 50, 'porcentage')],
      }],
    })];
    const original = structuredClone(equipped);
    const result = service.applyEquipmentFlatBonuses(stats(), attributes(), equipped);
    expect(result.stats.general.ad).toEqual({ min: 117, max: 217 });
    expect(result.atributos.STR).toEqual({ lvPoints: 20, bonusPoints: 13 });
    expect(equipped).toEqual(original);
  });

  it('accumulates percentages from equipment and multiple stones before applying them once', () => {
    const equipped = [
      item({
        explicitBonus: [bonus('ad', 'general.ad', 10, 'porcentage')],
        piedras: [{
          idItem: 1, name: 'Piedra 1', upgradeLv: 0,
          implicitBonus: [bonus('ad', 'general.ad', 20, 'porcentage'), attributeBonus(10, 'porcentage')],
          corruptExplicitBonus: [bonus('ad', 'general.ad', 999)],
        }],
      }),
      item({ piedras: [{
        idItem: 2, name: 'Piedra 2', upgradeLv: 0,
        implicitBonus: [],
        corruptExplicitBonus: [bonus('ad', 'general.ad', 30, 'porcentage'), attributeBonus(20, 'porcentage')],
      }] }),
    ];
    const original = structuredClone(equipped);
    const result = service.applyEquipmentPercentageBonuses(stats(), attributes(), equipped);
    expect(result.stats.general.ad).toEqual({ min: 160, max: 320 });
    expect(result.atributos.STR).toEqual({ lvPoints: 20, bonusPoints: 13 });
    expect(equipped).toEqual(original);
  });

  it('applies corrupt_item_acc on stones using the count of corrupt equipped items', () => {
    const equipped = [
      item({ corrupt: true, piedras: [{
        idItem: 1, name: 'Piedra', upgradeLv: 0,
        implicitBonus: [],
        corruptExplicitBonus: [
          bonus('def', 'general.def', 2, 'flat', accumulating),
          bonus('def', 'general.def', 5, 'porcentage', accumulating),
        ],
      }] }),
      item({ corrupt: true }), item({ corrupt: false }),
    ];
    expect(service.applyEquipmentFlatBonuses(stats(), attributes(), equipped).stats.general.def).toBe(104);
    expect(service.applyEquipmentPercentageBonuses(stats(), attributes(), equipped).stats.general.def).toBeCloseTo(110);
  });

  it('returns unchanged copies when no equipment is provided', () => {
    const base = stats();
    const attrs = attributes();
    const result = service.applyEquipmentFlatBonuses(base, attrs, []);
    expect(result).toEqual({ stats: base, atributos: attrs });
    expect(result.stats).not.toBe(base);
    expect(result.atributos).not.toBe(attrs);
  });
});
