import { BonusInItem, EquipType } from 'netim2-shared';

/** Equipo y piedras con corrupt_item_acc aplicado exactamente una vez. */
export function collectEquipmentBonuses(equip: EquipType[]): BonusInItem[] {
  const count = equip.filter((item) => item.corrupt === true).length;
  return equip
    .flatMap((item) => getEquipmentBonuses(item))
    .map((bonus) => {
      const multiplier =
        bonus.category.type === 'corrupt' &&
        bonus.category.sub_type === 'corrupt_item_acc'
          ? count
          : 1;
      const value = bonus.bonusValue;
      return {
        ...bonus,
        bonusValue:
          typeof value === 'number'
            ? value * multiplier
            : { min: value.min * multiplier, max: value.max * multiplier },
      };
    });
}

function getEquipmentBonuses(item: EquipType): BonusInItem[] {
  return [
    ...(item.implicitBonus ?? []),
    ...(item.randomImplicitBonus ?? []),
    ...(item.explicitBonus ?? []),
    ...(item.bonus6_7 ?? []),
    ...(item.corruptExplicitBonus ?? []),
    ...(item.corruptImplicitBonus ?? []),
    ...(item.piedras ?? []).flatMap((piedra) => [
      ...(piedra.implicitBonus ?? []),
      ...(piedra.corruptExplicitBonus ?? []),
    ]),
  ];
}
