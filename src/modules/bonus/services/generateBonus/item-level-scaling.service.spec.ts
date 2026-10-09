import { ItemLevelScalingService } from './item-level-scaling.service';

describe('ItemLevelScalingService', () => {
  const service = new ItemLevelScalingService();

  it.each([
    [100, 1, 50],
    [100, 100, 100],
    [100, 110, 105],
    [100, 200, 150],
    [-100, 1, -50],
    [-100, 100, -100],
    [-100, 110, -105],
    [1, 1, 1],
    [-1, 1, -1],
    [0, 1, 0],
    [25, 1, 12],
  ])('scales %i at level %i to %i', (value, level, expected) => {
    expect(service.applyItemLevelScalingToBonus(value, level)).toBe(expected);
  });

  it('increases the multiplier by 0.5 percent per level above 100', () => {
    expect(service.applyItemLevelScalingToBonus(1000, 101)).toBe(1005);
    expect(service.applyItemLevelScalingToBonus(1000, 102)).toBe(1010);
  });
});
