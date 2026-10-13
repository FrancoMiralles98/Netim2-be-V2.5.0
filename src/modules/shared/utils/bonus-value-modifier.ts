import type { ValueBonusType } from 'netim2-shared';

/** Un porcentaje positivo aumenta el valor numérico, incluso si el subtotal es negativo. */
export function applyBonusValue(
  base: number,
  total: number,
  operation: ValueBonusType,
): number {
  if (!Number.isFinite(base) || !Number.isFinite(total)) {
    throw new Error('El cálculo de bonus requiere valores finitos');
  }
  const result =
    operation === 'flat' ? base + total : base + (Math.abs(base) * total) / 100;
  if (!Number.isFinite(result)) {
    throw new Error('El resultado del bonus debe ser finito');
  }
  return result;
}
