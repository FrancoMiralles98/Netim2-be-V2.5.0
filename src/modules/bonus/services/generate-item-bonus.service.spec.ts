import { BonusCategory, BonusInItem } from 'netim2-shared';
import { BONUS_LIST } from '../const/bonus-list.cons';
import { RngService } from '../../shared/services/rng.service';
import { GenerateBonusService } from './generateBonus/generate-bonus.service';
import { SpecialBonusService } from './generateBonus/special-bonus.service';
import { ItemLevelScalingService } from './generateBonus/item-level-scaling.service';
import { GenerateItemBonusService } from './generate-item-bonus.service';

describe('GenerateItemBonusService', () => {
  const category: BonusCategory = { type: 'generic', tier: 1 };
  let service: GenerateItemBonusService;
  let generate: jest.MockedFunction<GenerateBonusService['generateBonus']>;
  let rng: RngService;

  function bonus(ref: BonusInItem['bonusRef']): BonusInItem {
    const definition = BONUS_LIST.find(entry =>
      entry.bonus_ref_name === ref && entry.category.type === 'generic',
    )!;
    return {
      bonusFullName: definition.full_name,
      bonusRef: ref,
      category: definition.category,
      effects: definition.effects,
      bonusValue: definition.values.max,
      origin: 'random',
    };
  }

  beforeEach(() => {
    generate = jest.fn();
    rng = new RngService();
    jest.spyOn(rng, 'randomNumberInRange').mockImplementation(min => min ?? 1);
    service = new GenerateItemBonusService(
      { generateBonus: generate } as unknown as GenerateBonusService,
      rng,
    );
  });

  afterEach(() => jest.restoreAllMocks());

  it('returns quantity bonus for random with an empty input, without a second generation', () => {
    generate.mockReturnValueOnce([bonus('orcos')])
      .mockReturnValueOnce([bonus('animales')])
      .mockReturnValueOnce([bonus('misticos')]);
    const result = service.buildItemBonus([], category, 'random', 100, 'normal', 5, 'arma', 3);
    expect(result.map(entry => entry.bonusRef)).toEqual(['orcos', 'animales', 'misticos']);
    expect(generate).toHaveBeenCalledTimes(3);
  });

  it('passes both external exclusions and the bonus already generated on every random roll', () => {
    const excluded = [bonus('hp')];
    Object.freeze(excluded);
    generate.mockReturnValueOnce([bonus('orcos')]).mockReturnValueOnce([bonus('animales')]);
    const result = service.buildItemBonus(excluded, category, 'random', 110, 'unique', 5, 'arma', 2);
    expect(generate).toHaveBeenNthCalledWith(1, category, excluded, 110, 'unique', 'arma');
    expect(generate.mock.calls[1][1]!.map(entry => entry.bonusRef)).toEqual(['hp', 'orcos']);
    expect(result.map(entry => entry.bonusRef)).toEqual(['orcos', 'animales']);
    expect(excluded).toHaveLength(1);
  });

  it('counts the special pair as two bonus when changing two originals', () => {
    generate.mockReturnValue([bonus('media'), bonus('habilidad')]);
    const original = [bonus('orcos'), bonus('animales')];
    Object.freeze(original);
    const result = service.buildItemBonus(original, category, 'change', 100, 'normal', 5, 'arma');
    expect(result.map(entry => entry.bonusRef)).toEqual(['media', 'habilidad']);
    expect(generate).toHaveBeenCalledTimes(1);
    expect(original.map(entry => entry.bonusRef)).toEqual(['orcos', 'animales']);
  });

  it('does not exclude replaced originals, but excludes new bonus on subsequent change rolls', () => {
    generate.mockReturnValueOnce([bonus('orcos')]).mockReturnValueOnce([bonus('animales')]);
    const result = service.buildItemBonus(
      [bonus('orcos'), bonus('hp')], category, 'change', 100, 'normal', 5, 'arma',
    );
    expect(generate.mock.calls[0][1]).toEqual([]);
    expect(generate.mock.calls[1][1]!.map(entry => entry.bonusRef)).toEqual(['orcos']);
    expect(result).toHaveLength(2);
  });

  it('trims to the requested quantity if the last roll is a pair, even below maxQuantity', () => {
    generate.mockReturnValueOnce([bonus('orcos')])
      .mockReturnValueOnce([bonus('animales')])
      .mockReturnValueOnce([bonus('media'), bonus('habilidad')]);
    const result = service.buildItemBonus([], category, 'random', 100, 'normal', 5, 'arma', 3);
    expect(result.map(entry => entry.bonusRef)).toEqual(['animales', 'media', 'habilidad']);
    expect(generate).toHaveBeenCalledTimes(3);
  });

  it('caps the requested quantity at maxQuantity', () => {
    generate.mockReturnValueOnce([bonus('orcos')]).mockReturnValueOnce([bonus('animales')]);
    expect(service.buildItemBonus([], category, 'random', 100, 'normal', 2, 'arma', 5)).toHaveLength(2);
    expect(generate).toHaveBeenCalledTimes(2);
  });

  it('adds and trims without modifying the input array', () => {
    const original = [bonus('orcos'), bonus('animales')];
    Object.freeze(original);
    generate.mockReturnValue([bonus('media'), bonus('habilidad')]);
    const result = service.buildItemBonus(original, category, 'add', 100, 'normal', 3, 'arma');
    expect(result.map(entry => entry.bonusRef)).toEqual(['animales', 'media', 'habilidad']);
    expect(original.map(entry => entry.bonusRef)).toEqual(['orcos', 'animales']);
    expect(generate.mock.calls[0][1]).toEqual(original);
  });

  it('returns a copy without generating when add is already at the cap', () => {
    const original = [bonus('orcos'), bonus('animales')];
    const result = service.buildItemBonus(original, category, 'add', 100, 'normal', 2, 'arma');
    expect(result).toEqual(original);
    expect(result).not.toBe(original);
    expect(generate).not.toHaveBeenCalled();
  });

  it('can remove multiple ordinary bonus from an existing oversized array without separating the pair', () => {
    const original = [bonus('orcos'), bonus('animales'), bonus('misticos'), bonus('media'), bonus('habilidad')];
    const result = service.buildItemBonus(original, category, 'add', 100, 'normal', 2, 'arma');
    expect(result.map(entry => entry.bonusRef)).toEqual(['media', 'habilidad']);
    expect(original).toHaveLength(5);
    expect(generate).not.toHaveBeenCalled();
  });

  it('keeps the documented error if the requested quantity cannot contain the inseparable pair', () => {
    generate.mockReturnValue([bonus('media'), bonus('habilidad')]);
    expect(() => service.buildItemBonus([], category, 'random', 100, 'normal', 5, 'arma', 1))
      .toThrow('No se puede ajustar el cap de bonus sin separar media/habilidad');
  });

  it.each(['add', 'change', 'random'] as const)('returns an empty list without generating for %s at a zero cap', action => {
    expect(service.buildItemBonus([], category, action, 100, 'normal', 0, 'arma', 3)).toEqual([]);
    expect(generate).not.toHaveBeenCalled();
  });

  it('allows quantity zero without generating', () => {
    expect(service.buildItemBonus([bonus('hp')], category, 'random', 100, 'normal', 5, 'arma', 0)).toEqual([]);
    expect(generate).not.toHaveBeenCalled();
  });

  it.each([undefined, -1, 1.5, NaN, Infinity])('rejects invalid random quantity %s before generating', quantity => {
    expect(() => service.buildItemBonus([], category, 'random', 100, 'normal', 5, 'arma', quantity))
      .toThrow('La cantidad de bonus debe ser un entero no negativo');
    expect(generate).not.toHaveBeenCalled();
  });

  it.each([-1, 1.5, NaN, Infinity])('rejects invalid maximum quantity %s', maximum => {
    expect(() => service.buildItemBonus([], category, 'add', 100, 'normal', maximum, 'arma'))
      .toThrow('El límite de bonus debe ser un entero no negativo');
  });

  it('works with the real generator, excluding implicit and already generated references', () => {
    const generator = new GenerateBonusService(new SpecialBonusService(rng), new ItemLevelScalingService(), rng);
    const integratedService = new GenerateItemBonusService(generator, rng);
    const excluded = [bonus('orcos'), bonus('animales')];
    const result = integratedService.buildItemBonus(excluded, category, 'random', 100, 'normal', 5, 'arma', 3);
    const refs = result.map(entry => entry.bonusRef);
    expect(refs).toHaveLength(3);
    expect(new Set(refs).size).toBe(3);
    expect(refs).not.toContain('orcos');
    expect(refs).not.toContain('animales');
  });
});
