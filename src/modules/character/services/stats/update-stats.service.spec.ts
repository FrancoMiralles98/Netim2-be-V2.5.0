import { Test } from '@nestjs/testing';
import {
  allFullNameBonusList,
  AppliedBuffos,
  Atributos,
  BonusInItem,
  EquipType,
  RoutStatKey,
  ValueBonusType,
} from 'netim2-shared';
import { GENERAL_CHARACTER_STATS } from '../../const/characterProps/base-character-stats.const';
import { STATS_PROGRESS_BY_RACE } from '../../const/statsProgress/stats-progress-by-race.const';
import { CharacterAttributesService } from './calculator/character-attributes.service';
import { CharacterLevelScalingService } from './calculator/character-level-scaling.service';
import { EquipStatsCalculatorService } from './calculator/equip-stats-calculator.service';
import { BuffStatsCalculatorService } from './calculator/buff-stats-calculator.service';
import { LimitBonusService } from '../../../bonus/services/limit-bonus.service';
import { MIN_BONUS_CONFIG } from '../../../bonus/config/min-bonus.config';
import { UpdateStatsService } from './update-stats.service';

// Valores de prueba estables: los casos verifican cálculos, no el balance del catálogo.
jest.mock('../../const/statsProgress/stats-progress-by-race.const', () => {
  const actual = jest.requireActual<typeof import('../../const/statsProgress/stats-progress-by-race.const')>(
    '../../const/statsProgress/stats-progress-by-race.const',
  );
  return {
    ...actual,
    STATS_PROGRESS_BY_RACE: {
      ...actual.STATS_PROGRESS_BY_RACE,
      guerrero: {
        base: { hp: 900, mana: 250, ap: 5, ad: 12, regen_hp: 8, regen_mana: 3 },
        per_lv: { hp: 26, mana: 5, ap: 1, ad: 2, regen_hp: 0.1, regen_mana: 0.04 },
      },
    },
  };
});

describe('UpdateStatsService', () => {
  const service = new UpdateStatsService(
    new CharacterLevelScalingService(),
    new CharacterAttributesService(),
    new EquipStatsCalculatorService(),
    new BuffStatsCalculatorService(),
    new LimitBonusService(),
  );
  function stats() {
    const result = structuredClone(GENERAL_CHARACTER_STATS);
    result.general.hp = { actual: 500, max: 99999 };
    result.general.mana = { actual: 100, max: 99999 };
    result.general.ad = { min: 9999, max: 9999 }; // snapshot calculado, no fuente base
    return result;
  }
  function attrs(str = 10): Atributos {
    return {
      STR: { lvPoints: str, bonusPoints: 0 },
      INT: { lvPoints: 0, bonusPoints: 0 },
      DEX: { lvPoints: 0, bonusPoints: 0 },
      VIT: { lvPoints: 0, bonusPoints: 0 },
    };
  }
  function bonus(
    target: RoutStatKey,
    value: BonusInItem['bonusValue'],
    operation: ValueBonusType = 'flat',
  ): BonusInItem {
    return {
      bonusFullName: allFullNameBonusList.MAX_HP,
      bonusRef: 'hp',
      bonusValue: value,
      category: { type: 'generic', tier: 1 },
      origin: 'random',
      effects: { type: 'stat_modifiers', target: [target], operation },
    };
  }
  function attribute(
    value: number,
    operation: ValueBonusType = 'flat',
  ): BonusInItem {
    return {
      ...bonus('general.ad', value, operation),
      effects: {
        type: 'attribute_modifier',
        target: 'atribute.STR.bonusPoints',
        operation,
      },
    };
  }
  function item(bonuses: BonusInItem[] = []): EquipType {
    return {
      implicitBonus: [],
      randomImplicitBonus: [],
      explicitBonus: bonuses,
      bonus6_7: [],
      corruptExplicitBonus: [],
      corruptImplicitBonus: [],
      piedras: [],
    } as unknown as EquipType;
  }
  function buff(bonuses: BonusInItem[]): AppliedBuffos {
    return {
      implicitBonus: bonuses,
      corruptBonus: [],
      id_buff: 1,
      buff_duration: 60,
      buff_base_duration: 60,
      buff_inicialization: Date.now(),
      buff_name: '',
      buff_description: '',
    };
  }

  it('resolves all calculators through Nest dependency injection', async () => {
    const module = await Test.createTestingModule({
      providers: [
        UpdateStatsService,
        CharacterLevelScalingService,
        CharacterAttributesService,
        EquipStatsCalculatorService,
        BuffStatsCalculatorService,
        LimitBonusService,
      ],
    }).compile();
    expect(module.get(UpdateStatsService)).toBeInstanceOf(UpdateStatsService);
    await module.close();
  });

  it('rebuilds race progression and derived stats without gear or buffs', () => {
    const result = service.updateStats(stats(), 'guerrero', [], attrs(), [], 1);
    expect(result.stats.general.ad).toEqual({ min: 32, max: 32 });
    expect(result.stats.general.ap).toEqual({ min: 5, max: 5 });
    expect(result.stats.general.hp).toEqual({ actual: 500, max: 900 });
    expect(result.stats.general.mana).toEqual({ actual: 100, max: 250 });
    expect(result.stats.bonus.daño.daño_critico).toBe(
      GENERAL_CHARACTER_STATS.bonus.daño.daño_critico,
    );
    expect(
      service.updateStats(stats(), 'guerrero', [], attrs(), [], 11).stats
        .general.ad.min,
    ).toBe(52);
  });

  it('derives AD from attributes modified by gear', () => {
    expect(
      service.updateStats(
        stats(),
        'guerrero',
        [item([attribute(5)])],
        attrs(),
        [],
        1,
      ).stats.general.ad.min,
    ).toBe(42);
  });

  it('applies buff attribute percentages to the full attribute: (10 + 5) * 1.2', () => {
    expect(
      service.updateStats(
        stats(),
        'guerrero',
        [item([attribute(5)])],
        attrs(),
        [buff([attribute(20, 'porcentage')])],
        1,
      ).stats.general.ad.min,
    ).toBe(48);
  });

  it('accumulates equipment and buff percentages additively in the attribute stage', () => {
    const result = service.updateStats(
      stats(),
      'guerrero',
      [item([attribute(5), attribute(10, 'porcentage')])],
      attrs(),
      [buff([attribute(20, 'porcentage')])],
      1,
    );
    expect(result.stats.general.ad.min).toBeCloseTo(51);
  });

  it('applies stat percentages to race base + effective attributes + all flat stats', () => {
    const result = service.updateStats(
      stats(),
      'guerrero',
      [
        item([
          attribute(5),
          bonus('general.ad', 10),
          bonus('general.ad', 20, 'porcentage'),
        ]),
      ],
      attrs(),
      [
        buff([
          attribute(20, 'porcentage'),
          bonus('general.ad', 5),
          bonus('general.ad', 10, 'porcentage'),
        ]),
      ],
      1,
    );
    expect(result.stats.general.ad.min).toBe(81.9);
  });

  it('combines positive/negative flats and increases/reductions as signed percentages', () => {
    const result = service.updateStats(
      stats(),
      'guerrero',
      [item([bonus('general.ad', 100), bonus('general.ad', 20, 'porcentage')])],
      attrs(0),
      [
        buff([
          bonus('general.ad', -30),
          bonus('general.ad', -10, 'porcentage'),
        ]),
      ],
      1,
    );
    expect(result.stats.general.ad.min).toBe(90.2);
  });

  it('can recalculate its own result repeatedly without accumulating modifiers', () => {
    const source = attrs();
    const gear = [item([attribute(5), bonus('general.ad', 10)])];
    const buffs = [
      buff([
        attribute(20, 'porcentage'),
        bonus('general.ad', 10, 'porcentage'),
      ]),
    ];
    const first = service.updateStats(
      stats(),
      'guerrero',
      gear,
      source,
      buffs,
      11,
    );
    const second = service.updateStats(
      first.stats,
      'guerrero',
      gear,
      source,
      buffs,
      11,
    );
    expect(second).toEqual(first);
    expect(
      service.updateStats(second.stats, 'guerrero', gear, source, buffs, 11),
    ).toEqual(first);
    expect(source).toEqual(attrs());
  });

  it('removing equipment/buffs removes their bonuses from the next result', () => {
    const boosted = service.updateStats(
      stats(),
      'guerrero',
      [item([attribute(10)])],
      attrs(),
      [buff([bonus('general.ad', 20, 'porcentage')])],
      1,
    );
    expect(
      service.updateStats(boosted.stats, 'guerrero', [], attrs(), [], 1),
    ).toEqual(service.updateStats(stats(), 'guerrero', [], attrs(), [], 1));
  });

  it('increases resource maxima without healing and includes VIT before resource flats/percentages', () => {
    const source = attrs(0);
    source.VIT.lvPoints = 10;
    const result = service.updateStats(
      stats(),
      'guerrero',
      [
        item([
          bonus('general.hp', 100),
          bonus('general.mana', 100),
          bonus('general.hp', 10, 'porcentage'),
        ]),
      ],
      source,
      [
        buff([
          bonus('general.hp', 20, 'porcentage'),
          bonus('general.mana', 30, 'porcentage'),
        ]),
      ],
      1,
    );
    expect(result.stats.general.hp.max).toBeCloseTo(1417);
    expect(result.stats.general.hp.actual).toBe(500);
    expect(result.stats.general.mana).toEqual({ actual: 100, max: 455 });
  });

  it.each([400, 900])(
    'preserves or clamps current HP %i after decreasing max',
    (current) => {
      const input = stats();
      input.general.hp.actual = current;
      const result = service.updateStats(
        input,
        'guerrero',
        [item([bonus('general.hp', -200), bonus('general.mana', -200)])],
        attrs(0),
        [],
        1,
      );
      expect(result.stats.general.hp).toEqual({
        actual: Math.min(current, 700),
        max: 700,
      });
      expect(result.stats.general.mana).toEqual({ actual: 50, max: 50 });
    },
  );

  it('normalizes only current/max resources while preserving negative damage ranges', () => {
    const input = stats();
    input.general.hp.actual = -5;
    input.general.mana.actual = -2;
    const result = service.updateStats(
      input,
      'guerrero',
      [
        item([
          bonus('general.hp', -2000),
          bonus('general.mana', -2000),
          bonus('general.ad', -100),
        ]),
      ],
      attrs(0),
      [],
      1,
    );
    expect(result.stats.general.hp).toEqual({ actual: 0, max: 0 });
    expect(result.stats.general.mana).toEqual({ actual: 0, max: 0 });
    expect(result.stats.general.ad).toEqual({ min: -88, max: -88 });
  });

  it('respects bonus caps and their modifiers without capping unrelated total stats', () => {
    const modifier = bonus('bonus.defensa.bloquear_ataques', 10);
    modifier.effects = {
      type: 'stats_cap_modifier',
      target: 'bloquear_ataques',
      operation: 'flat',
    };
    const result = service.updateStats(
      stats(),
      'guerrero',
      [
        item([
          bonus('bonus.defensa.bloquear_ataques', 100),
          modifier,
          bonus('general.ad', 1000),
        ]),
      ],
      attrs(0),
      [],
      1,
    );
    expect(result.stats.bonus.defensa.bloquear_ataques).toBe(50);
    expect(result.stats.general.ad.min).toBe(1012);
  });

  it('includes buff attribute caps, stones, and equipment corruption when deriving stats', () => {
    const gear = item([attribute(2)]);
    gear.corrupt = true;
    gear.explicitBonus[0].category = {
      type: 'corrupt',
      sub_type: 'corrupt_item_acc',
    };
    gear.piedras = [
      {
        idItem: 1,
        name: '',
        upgradeLv: 0,
        implicitBonus: [attribute(3)],
        corruptExplicitBonus: [],
      },
    ];
    const second = item();
    second.corrupt = true;
    const cap = attribute(-100);
    cap.effects = {
      type: 'attribute_cap_modifier',
      target: 'STR',
      operation: 'flat',
    };
    const source = attrs(150);
    source.STR.bonusPoints = 150;
    const result = service.updateStats(
      stats(),
      'guerrero',
      [gear, second],
      source,
      [buff([cap])],
      1,
    );
    expect(result.stats.general.ad.min).toBe(212); // cap general STR = 100
    expect(source.STR).toEqual({ lvPoints: 150, bonusPoints: 150 });
  });

  it('returns attributes updated by flat and percentage modifiers without cutting lvPoints or bonuses at the cap', () => {
    const source = attrs();
    const result = service.updateStats(
      stats(),
      'guerrero',
      [item([attribute(5)])],
      source,
      [buff([attribute(20, 'porcentage')])],
      1,
    );
    expect(result.attributes.STR).toEqual({ lvPoints: 10, bonusPoints: 8 });
    expect(result.attributes).not.toBe(source);
    expect(source.STR).toEqual({ lvPoints: 10, bonusPoints: 0 });

    const overCap = attrs(150);
    overCap.STR.bonusPoints = 300;
    const cappedResult = service.updateStats(
      stats(),
      'guerrero',
      [item([attribute(5)])],
      overCap,
      [],
      1,
    );
    expect(cappedResult.attributes.STR).toEqual({
      lvPoints: 150,
      bonusPoints: 305,
    });
    expect(cappedResult.stats.general.ad.min).toBe(412);
  });

  it('derives stats from the already modified attributes with each cap applied only once', () => {
    const calculator = new CharacterAttributesService();
    const caps = jest.spyOn(calculator, 'capEffectiveAttributes');
    const derived = jest.spyOn(calculator, 'applyEffectiveAttributeBenefits');
    const convenience = jest.spyOn(calculator, 'applyAttributeBenefits');
    const tested = new UpdateStatsService(
      new CharacterLevelScalingService(),
      calculator,
      new EquipStatsCalculatorService(),
      new BuffStatsCalculatorService(),
      new LimitBonusService(),
    );
    const result = tested.updateStats(
      stats(),
      'guerrero',
      [item([attribute(10)])],
      attrs(),
      [],
      1,
    );
    expect(result.attributes.STR).toEqual({ lvPoints: 10, bonusPoints: 10 });
    expect(result.stats.general.ad.min).toBe(52);
    expect(caps).toHaveBeenCalledTimes(1);
    expect(derived).toHaveBeenCalledTimes(1);
    expect(derived.mock.calls[0][1].STR).toBe(20);
    expect(convenience).not.toHaveBeenCalled();
  });

  it('calculates (100 + 30 - 10) with 20% increased and 5% reduced as 138', () => {
    const result = service.updateStats(
      stats(),
      'guerrero',
      [item([bonus('general.ad', 30), bonus('general.ad', 20, 'porcentage')])],
      attrs(44),
      [buff([bonus('general.ad', -10), bonus('general.ad', -5, 'porcentage')])],
      1,
    );
    expect(result.stats.general.ad).toEqual({ min: 138, max: 138 });
  });

  it.each([
    [20, -80],
    [-20, -120],
    [200, 100],
  ])(
    'applies percentage %i to negative AD using numeric direction, yielding %i',
    (percentage, expected) => {
      const result = service.updateStats(
        stats(),
        'guerrero',
        [
          item([
            bonus('general.ad', -112),
            bonus('general.ad', percentage, 'porcentage'),
            bonus('general.vh', -30),
            bonus('general.vm', -20),
            bonus('general.def', -15),
          ]),
        ],
        attrs(0),
        [],
        1,
      );
      expect(result.stats.general.ad).toEqual({ min: expected, max: expected });
      expect(result.stats.general.vh).toBe(-30);
      expect(result.stats.general.vm).toBe(-20);
      expect(result.stats.general.def).toBe(-15);
    },
  );

  it('preserves and orders range endpoints when percentage penalties reverse their order', () => {
    const result = service.updateStats(
      stats(),
      'guerrero',
      [
        item([
          bonus('general.ad', { min: 38, max: 88 }),
          bonus('general.ad', -200, 'porcentage'),
        ]),
      ],
      attrs(0),
      [],
      1,
    );
    expect(result.stats.general.ad).toEqual({ min: -100, max: -50 });
  });

  it('applies corruption to equipment cap modifiers exactly once and buff caps as their stored value', () => {
    const gearCap = attribute(5);
    gearCap.category = { type: 'corrupt', sub_type: 'corrupt_item_acc' };
    gearCap.effects = {
      type: 'attribute_cap_modifier',
      target: 'STR',
      operation: 'flat',
    };
    const buffCap = { ...gearCap, bonusValue: 7 };
    const gear = item([gearCap]);
    gear.corrupt = true;
    const second = item();
    second.corrupt = true;
    const source = attrs(150);
    source.STR.bonusPoints = 500;
    const result = service.updateStats(
      stats(),
      'guerrero',
      [gear, second],
      source,
      [buff([buffCap])],
      1,
    );
    expect(result.stats.general.ad.min).toBe(446); // (200 + 5 * 2 + 7) * 2 + 12
  });

  it('applies configured minima after percentages, without restricting other negative stats', () => {
    const previous = MIN_BONUS_CONFIG.def;
    MIN_BONUS_CONFIG.def = -10;
    try {
      const result = service.updateStats(
        stats(),
        'guerrero',
        [
          item([
            bonus('general.def', -20),
            bonus('general.def', 20, 'porcentage'),
            bonus('general.vm', -500),
          ]),
        ],
        attrs(0),
        [],
        1,
      );
      expect(result.stats.general.def).toBe(-10); // -20 + 20% = -16; luego mínimo -10
      expect(result.stats.general.vm).toBe(-500);
    } finally {
      if (previous === undefined) delete MIN_BONUS_CONFIG.def;
      else MIN_BONUS_CONFIG.def = previous;
    }
  });

  it('is deterministic and leaves both base constants unchanged', () => {
    const source = attrs(),
      input = stats(),
      gear = [item([attribute(5)])],
      buffs = [buff([bonus('general.ad', 10)])];
    const constants = structuredClone({
      stats: GENERAL_CHARACTER_STATS,
      progress: STATS_PROGRESS_BY_RACE,
    });
    expect(
      service.updateStats(input, 'guerrero', gear, source, buffs, 11),
    ).toEqual(service.updateStats(input, 'guerrero', gear, source, buffs, 11));
    expect({
      stats: GENERAL_CHARACTER_STATS,
      progress: STATS_PROGRESS_BY_RACE,
    }).toEqual(constants);
  });

  it('keeps at most one decimal without rounding in every stat, including negatives and resources', () => {
    const input = stats();
    input.general.hp.actual = 500.99;
    input.general.mana.actual = 100.99;
    const result = service.updateStats(input, 'guerrero', [item([
      bonus('general.ad', { min: 0.99, max: 5.99 }),
      bonus('general.def', -12.89), bonus('general.vm', -0.09),
      bonus('bonus.daño.critico', 45.99),
    ])], attrs(0), [], 1);
    expect(result.stats.general.ad).toEqual({ min: 12.9, max: 17.9 });
    expect(result.stats.general.def).toBe(-12.8);
    expect(Object.is(result.stats.general.vm, 0)).toBe(true);
    expect(result.stats.bonus.daño.critico).toBe(45.9);
    expect(result.stats.general.hp.actual).toBe(500.9);
    expect(result.stats.general.mana.actual).toBe(100.9);
    const check = (value: object): void => {
      for (const entry of Object.values(value)) {
        if (typeof entry === 'number') expect(entry).toBeCloseTo(Math.trunc(entry * 10) / 10, 10);
        else if (entry && typeof entry === 'object') check(entry);
      }
    };
    check(result.stats);
    expect(input.general.hp.actual).toBe(500.99);
  });

  it('keeps precision during intermediate calculations and in returned attributes', () => {
    const result = service.updateStats(stats(), 'guerrero', [item([
      attribute(5), bonus('general.ad', 0.8),
    ])], attrs(), [buff([
      attribute(25, 'porcentage'), bonus('general.ad', 0.8),
    ])], 1);
    expect(result.attributes.STR).toEqual({ lvPoints: 10, bonusPoints: 8.75 });
    expect(result.stats.general.ad.min).toBe(51.1); // 12 + 18.75 * 2 + 0.8 + 0.8 = 51.1
  });

  it('does not mutate any input and rejects non-finite source values', () => {
    const input = stats(),
      source = attrs(),
      gear = [item([attribute(5)])],
      buffs = [buff([bonus('general.ad', 10)])];
    const original = structuredClone({ input, source, gear, buffs });
    service.updateStats(input, 'guerrero', gear, source, buffs, 1);
    expect({ input, source, gear, buffs }).toEqual(original);
    expect(() =>
      service.updateStats(
        input,
        'guerrero',
        [item([attribute(NaN)])],
        source,
        buffs,
        1,
      ),
    ).toThrow('finitos');
    expect(() =>
      service.updateStats(input, 'guerrero', [], source, [], 0),
    ).toThrow('nivel');
  });
});
