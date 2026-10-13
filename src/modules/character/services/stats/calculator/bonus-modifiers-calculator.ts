import {
  Atributos,
  BonusInItem,
  RoutStatKey,
  Stats,
  ValueBonusType,
} from 'netim2-shared';
import { applyBonusValue } from '../../../../shared/utils/bonus-value-modifier';

type BonusRange = { min: number; max: number };

/** Motor compartido: porcentajes aditivos por destino y separación de etapas. */
export function applyBonusModifiers(
  stats: Stats,
  atributos: Atributos,
  bonuses: BonusInItem[],
  operation: ValueBonusType,
  scope: 'all' | 'attributes' | 'stats' = 'all',
  attributeBasis: 'bonus' | 'total' = 'bonus',
): { stats: Stats; atributos: Atributos } {
  const result = {
    stats: structuredClone(stats),
    atributos: structuredClone(atributos),
  };
  const statTotals = new Map<RoutStatKey, BonusRange>();
  const attributeTotals = new Map<keyof Atributos, number>();

  for (const bonus of bonuses) {
    const effect = bonus.effects;
    // Caps y efectos condicionales pertenecen a sus respectivos sistemas.
    if (
      effect.operation !== operation ||
      (effect.type !== 'stat_modifiers' &&
        effect.type !== 'attribute_modifier') ||
      (scope === 'stats' && effect.type === 'attribute_modifier') ||
      (scope === 'attributes' && effect.type === 'stat_modifiers')
    ) {
      continue;
    }

    assertBonusValue(bonus.bonusValue);
    if (effect.type === 'attribute_modifier') {
      if (typeof bonus.bonusValue !== 'number') {
        throw new Error('Un bonus de atributo debe tener un valor numérico');
      }
      const attribute = effect.target.split('.')[1] as keyof Atributos;
      attributeTotals.set(
        attribute,
        (attributeTotals.get(attribute) ?? 0) + bonus.bonusValue,
      );
      continue;
    }

    // Un valor numérico aporta lo mismo a ambos extremos de AD/AP.
    const range =
      typeof bonus.bonusValue === 'number'
        ? { min: bonus.bonusValue, max: bonus.bonusValue }
        : bonus.bonusValue;
    for (const target of new Set(effect.target)) {
      const total = statTotals.get(target) ?? { min: 0, max: 0 };
      statTotals.set(target, {
        min: total.min + range.min,
        max: total.max + range.max,
      });
    }
  }

  for (const [target, total] of statTotals) {
    applyStatTotal(result.stats, target, total, operation);
  }
  for (const [attribute, total] of attributeTotals) {
    const points = result.atributos[attribute];
    const base =
      attributeBasis === 'total'
        ? points.lvPoints + points.bonusPoints
        : points.bonusPoints;
    points.bonusPoints =
      applyValue(base, total, operation) -
      (attributeBasis === 'total' ? points.lvPoints : 0);
  }
  return result;
}

function assertBonusValue(value: BonusInItem['bonusValue']): void {
  const values = typeof value === 'number' ? [value] : [value.min, value.max];
  if (values.some((number) => !Number.isFinite(number))) {
    throw new Error('El valor de un bonus debe ser finito');
  }
}

function applyStatTotal(
  stats: Stats,
  target: RoutStatKey,
  total: BonusRange,
  operation: ValueBonusType,
): void {
  if (target === 'general.ad' || target === 'general.ap') {
    const range = target === 'general.ad' ? stats.general.ad : stats.general.ap;
    range.min = applyValue(range.min, total.min, operation);
    range.max = applyValue(range.max, total.max, operation);
    return;
  }

  if (total.min !== total.max) {
    throw new Error(
      `El bonus con rango solo puede aplicarse a AD/AP: ${target}`,
    );
  }
  if (target === 'general.hp' || target === 'general.mana') {
    const resource =
      target === 'general.hp' ? stats.general.hp : stats.general.mana;
    resource.max = applyValue(resource.max, total.min, operation);
    return;
  }

  const parts = target.split('.');
  const group =
    parts[0] === 'general'
      ? stats.general
      : stats.bonus[parts[1] as keyof Stats['bonus']];
  const values = group as unknown as Record<string, number>;
  const key = parts[parts.length - 1];
  if (typeof values?.[key] !== 'number') {
    throw new Error(
      `No existe una estadística numérica para el destino ${target}`,
    );
  }
  values[key] = applyValue(values[key], total.min, operation);
}

function applyValue(
  base: number,
  total: number,
  operation: ValueBonusType,
): number {
  return applyBonusValue(base, total, operation);
}
