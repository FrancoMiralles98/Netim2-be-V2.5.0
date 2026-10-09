import { allFullNameBonusList, AppliedBuffos, Atributos, BonusInItem, RoutStatKey, ValueBonusType } from 'netim2-shared';
import { GENERAL_CHARACTER_STATS } from '../../const/characterProps/base-character-stats.const';
import { BuffStatsCalculatorService } from './buff-stats-calculator.service';

describe('BuffStatsCalculatorService', () => {
  const service = new BuffStatsCalculatorService();
  function stats() {
    const result = structuredClone(GENERAL_CHARACTER_STATS);
    result.general.def = 100;
    result.general.ad = { min: 100, max: 200 };
    return result;
  }
  function attributes(): Atributos {
    return {
      STR: { lvPoints: 20, bonusPoints: 10 }, INT: { lvPoints: 0, bonusPoints: 0 },
      DEX: { lvPoints: 0, bonusPoints: 0 }, VIT: { lvPoints: 0, bonusPoints: 0 },
    };
  }
  function bonus(target: RoutStatKey, value: BonusInItem['bonusValue'], operation: ValueBonusType = 'flat'): BonusInItem {
    return {
      bonusFullName: allFullNameBonusList.MAX_HP, bonusRef: 'hp',
      category: { type: 'generic', tier: 1 }, origin: 'configured', bonusValue: value,
      effects: { type: 'stat_modifiers', operation, target: [target] },
    };
  }
  function buff(implicitBonus: BonusInItem[] = [], corruptBonus: BonusInItem[] = []): AppliedBuffos {
    return {
      implicitBonus, corruptBonus, id_buff: 1, buff_duration: 60, buff_base_duration: 60,
      buff_inicialization: Date.now(), buff_description: '', buff_name: 'Buff',
    };
  }

  it('applies flat bonuses from both arrays and only the flat operation', () => {
    const result = service.applyBuffFlatBonuses(stats(), attributes(), [
      buff([bonus('general.def', 10), bonus('general.def', 99, 'porcentage')], [bonus('general.def', 20)]),
    ]);
    expect(result.stats.general.def).toBe(130);
  });

  it('sums percentages across all buffs and both arrays before calculating the result', () => {
    const result = service.applyBuffPercentageBonuses(stats(), attributes(), [
      buff([bonus('general.def', 10, 'porcentage')], [bonus('general.def', 5, 'porcentage')]),
      buff([bonus('general.def', 20, 'porcentage'), bonus('general.def', 999)]),
    ]);
    expect(result.stats.general.def).toBe(135);
  });

  it('handles AD/AP ranges and scalar bonuses, including percentage accumulation on both endpoints', () => {
    const flat = service.applyBuffFlatBonuses(stats(), attributes(), [
      buff([bonus('general.ad', { min: 3, max: 5 }), bonus('general.ap', 2)], [bonus('general.ad', 2)]),
    ]);
    expect(flat.stats.general.ad).toEqual({ min: 105, max: 207 });
    expect(flat.stats.general.ap).toEqual({ min: 22, max: 22 });
    const percent = service.applyBuffPercentageBonuses(stats(), attributes(), [
      buff([bonus('general.ad', 10, 'porcentage')]),
      buff([], [bonus('general.ad', 20, 'porcentage')]),
    ]);
    expect(percent.stats.general.ad).toEqual({ min: 130, max: 260 });
  });

  it('modifies only attribute bonusPoints for flat and accumulated percentage effects', () => {
    const flat = bonus('general.def', 5);
    flat.effects = { type: 'attribute_modifier', operation: 'flat', target: 'atribute.STR.bonusPoints' };
    const first = bonus('general.def', 10, 'porcentage');
    first.effects = { type: 'attribute_modifier', operation: 'porcentage', target: 'atribute.STR.bonusPoints' };
    const second = { ...first, bonusValue: 20 };
    const buffs = [buff([flat, first]), buff([], [second])];
    expect(service.applyBuffFlatBonuses(stats(), attributes(), buffs).atributos.STR)
      .toEqual({ lvPoints: 20, bonusPoints: 15 });
    expect(service.applyBuffPercentageBonuses(stats(), attributes(), buffs).atributos.STR)
      .toEqual({ lvPoints: 20, bonusPoints: 13 });
  });

  it('changes resource maxima without changing current HP/mana and supports negative bonuses', () => {
    const flat = service.applyBuffFlatBonuses(stats(), attributes(), [
      buff([bonus('general.hp', 100), bonus('general.mana', 20)], [bonus('general.def', -10)]),
    ]);
    expect(flat.stats.general.hp).toEqual({ actual: 500, max: 1100 });
    expect(flat.stats.general.mana).toEqual({ actual: 100, max: 120 });
    expect(flat.stats.general.def).toBe(90);
    expect(service.applyBuffPercentageBonuses(stats(), attributes(), [
      buff([bonus('general.def', -10, 'porcentage')]),
    ]).stats.general.def).toBe(90);
  });

  it('ignores cap and conditional effects', () => {
    const cap = bonus('general.def', 999);
    cap.effects = { type: 'stats_cap_modifier', operation: 'flat', target: 'def' };
    const conditional = bonus('general.def', 999, 'porcentage');
    conditional.effects = { type: 'conditional_modifier', operation: 'porcentage', target: 'general.def', conditions: [] };
    const buffs = [buff([cap, conditional])];
    expect(service.applyBuffFlatBonuses(stats(), attributes(), buffs).stats).toEqual(stats());
    expect(service.applyBuffPercentageBonuses(stats(), attributes(), buffs).stats).toEqual(stats());
  });

  it('allows flat then percentage passes without mutating stats, attributes, or buffs', () => {
    const base = stats();
    const attrs = attributes();
    const buffs = [buff([bonus('general.def', 50), bonus('general.def', 10, 'porcentage')],
      [bonus('general.def', 20, 'porcentage')])];
    const original = structuredClone({ base, attrs, buffs });
    const flat = service.applyBuffFlatBonuses(base, attrs, buffs);
    const result = service.applyBuffPercentageBonuses(flat.stats, flat.atributos, buffs);
    expect(result.stats.general.def).toBe(195);
    expect(flat.stats.general.def).toBe(150);
    expect({ base, attrs, buffs }).toEqual(original);
    expect(service.applyBuffFlatBonuses(base, attrs, [])).toEqual({ stats: base, atributos: attrs });
  });
});
