import { BonusCategory, BonusInItem, BonusType, ItemBonusQuality } from 'netim2-shared';
import { BONUS_LIST } from '../const/bonus-list.cons';
import { RngService } from '../../shared/services/rng.service';
import { GenerateBonusService } from './generate-bonus.service';
import { SpecialBonusService } from './special-bonus.service';
import { ItemLevelScalingService } from './item-level-scaling.service';

describe('GenerateBonusService', () => {
  let service: GenerateBonusService;
  let random: jest.SpyInstance;
  const generic: BonusCategory = { type: 'generic', tier: 1 };

  function itemBonus(definition: BonusType): BonusInItem {
    return {
      bonusFullName: definition.full_name,
      bonusRef: definition.bonus_ref_name,
      category: definition.category,
      effects: definition.effects,
      bonusValue: definition.values.max,
      origin: 'random',
    };
  }

  function usedExcept(refs: BonusInItem['bonusRef'][]): BonusInItem[] {
    return BONUS_LIST.filter(bonus => !refs.includes(bonus.bonus_ref_name)).map(itemBonus);
  }

  beforeEach(() => {
    const rng = new RngService();
    random = jest.spyOn(rng, 'randomNumberInRange').mockImplementation(min => min ?? 1);
    service = new GenerateBonusService(
      new SpecialBonusService(rng),
      new ItemLevelScalingService(),
      rng,
    );
  });

  afterEach(() => jest.restoreAllMocks());

  it.each<[ItemBonusQuality, number]>([
    ['normal', 2],
    ['unique', 3],
  ])('uses the probabilities of %s quality instead of the supplied generic tier', (quality, tier) => {
    random.mockImplementation((min, _max, decimal) => decimal ? 75 : min);
    const result = service.generateBonus(generic, [], 100, quality, 'armadura');
    expect(result).toHaveLength(1);
    expect(result[0].category).toEqual({ type: 'generic', tier });
    expect(result[0].origin).toBe('random');
  });

  it('filters equipment and used references before selecting a tier', () => {
    // orcos exists in three categories; regen_hp is not valid for arma.
    const result = service.generateBonus(generic, usedExcept(['orcos', 'regen_hp']), 100, 'normal', 'arma');
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ bonusRef: 'orcos', bonusValue: 10, category: generic });
    expect(result[0].effects).toEqual(
      BONUS_LIST.find(bonus => bonus.bonus_ref_name === 'orcos' && bonus.category.type === 'generic')!.effects,
    );
  });

  it('falls back to a higher tier when the chosen tier has no candidates', () => {
    const result = service.generateBonus(generic, usedExcept(['hp']), 100, 'normal', 'armadura');
    expect(result[0].category).toEqual({ type: 'generic', tier: 3 });
  });

  it('falls back to a lower tier when no higher tier is available', () => {
    random.mockReturnValueOnce(99.9);
    const result = service.generateBonus(generic, usedExcept(['orcos']), 100, 'normal', 'arma');
    expect(result[0].category).toEqual(generic);
  });

  it.each<[BonusCategory]>([
    [{ type: 'corrupt', sub_type: 'corrupt_item_acc' }],
    [{ type: 'bonus6_7' }],
  ])('generates one non-generic bonus without rolling a tier: %o', category => {
    const result = service.generateBonus(category, usedExcept(['hp']), 1, 'unique', 'armadura');
    const definition = BONUS_LIST.find(bonus =>
      bonus.bonus_ref_name === 'hp' && bonus.category.type === category.type,
    )!;
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      bonusRef: 'hp',
      category,
      bonusValue: Math.floor(definition.values.min * 0.5),
    });
    expect(random.mock.calls.every(call => call[2] !== true)).toBe(true);
  });

  it('matches the corrupt subtype by value rather than object identity', () => {
    expect(() => service.generateBonus(
      { type: 'corrupt', sub_type: 'none' }, [], 100, 'normal', 'armadura',
    )).toThrow('No hay bonus disponibles');
    expect(random).not.toHaveBeenCalled();
  });

  it.each([1, 100, 110])('returns media and its negative counterpart scaled at level %i', level => {
    random
      .mockReturnValueOnce(99.9) // generic tier 4
      .mockReturnValueOnce(0) // media
      .mockReturnValueOnce(94) // internal roll tier 2
      .mockReturnValueOnce(40)
      .mockReturnValueOnce(20);

    const result = service.generateBonus(generic, usedExcept(['media', 'habilidad']), level, 'normal', 'arma');
    const values = level === 1 ? [20, -10] : level === 100 ? [40, -20] : [42, -21];
    expect(result.map(bonus => bonus.bonusRef)).toEqual(['media', 'habilidad']);
    expect(result.map(bonus => bonus.bonusValue)).toEqual(values);
    expect(result.map(bonus => bonus.category)).toEqual([
      { type: 'generic', tier: 4 }, { type: 'generic', tier: 4 },
    ]);
    expect(random).toHaveBeenNthCalledWith(4, 26, 40);
    expect(random).toHaveBeenNthCalledWith(5, 13, 20);
  });

  it('generates positive habilidad with negative media from the same internal tier', () => {
    random
      .mockReturnValueOnce(99.9)
      .mockReturnValueOnce(1) // habilidad
      .mockReturnValueOnce(99.6) // internal tier 4, fractional probability
      .mockReturnValueOnce(30)
      .mockReturnValueOnce(60);
    const result = service.generateBonus(generic, usedExcept(['media', 'habilidad']), 100, 'normal', 'arma');
    expect(result.map(bonus => [bonus.bonusRef, bonus.bonusValue])).toEqual([
      ['habilidad', 30], ['media', -60],
    ]);
    expect(random).toHaveBeenNthCalledWith(4, 26, 30);
    expect(random).toHaveBeenNthCalledWith(5, 51, 60);
  });

  it.each(['media', 'habilidad'] as const)('excludes both members of the pair when %s is already used', ref => {
    const used = itemBonus(BONUS_LIST.find(bonus => bonus.bonus_ref_name === ref)!);
    random.mockReturnValueOnce(99.9);
    const result = service.generateBonus(generic, [used], 100, 'normal', 'arma');
    expect(result).toHaveLength(1);
    expect(['media', 'habilidad']).not.toContain(result[0].bonusRef);
  });

  it('scales a normal roll after choosing it and allows exceeding its base maximum', () => {
    random.mockReturnValueOnce(0).mockReturnValueOnce(0).mockReturnValueOnce(20);
    const result = service.generateBonus(generic, usedExcept(['orcos']), 110, 'normal', 'arma');
    expect(result[0].bonusValue).toBe(21);
    expect(random).toHaveBeenNthCalledWith(3, 10, 20);
  });

  it('throws without rolling when no candidates remain', () => {
    expect(() => service.generateBonus(
      generic, BONUS_LIST.map(itemBonus), 100, 'normal', 'arma',
    )).toThrow('No hay bonus disponibles');
    expect(random).not.toHaveBeenCalled();
  });
});
