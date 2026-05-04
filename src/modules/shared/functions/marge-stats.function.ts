import { CharacterStats } from "src/modules/character/types/baseCharacterProps/character-stats.type";
import { MobStats } from "src/modules/mob/types/mobProps/mob-stats.type";

/**
 * Realiza un merge profundo entre dos estructuras de stats sumando sus valores numéricos.
 *
 * Uso:
 * Combinar una estructura base de estadísticas (base) con una estructura parcial (extra),
 * acumulando valores en lugar de sobrescribirlos.
 *
 * 🔹 Comportamiento:
 * - Si el valor es un `number`, se suma al valor existente.
 * - Si el valor es un `object`, se recorre recursivamente (deep merge).
 * - Si el valor es otro tipo (string, boolean, array, etc), se reemplaza.
 * - Las propiedades `undefined` son ignoradas.
 *
 * @param base - Estructura base completa de stats.
 * @param extra - Estructura parcial de stats a combinar.
 * @returns Nueva estructura de stats con los valores combinados.
 */

export const mergeStats = <T extends CharacterStats | MobStats>(
    base: T,
    extra: Partial<T>
): T => {
    const result = structuredClone(base);

    function merge(target: Record<string,unknown>, source: Record<string,unknown>): void {
    for (const key of Object.keys(source)) {
      const value = source[key];

      if (value === undefined) continue;

      if (typeof value === 'number') {
        const current = target[key];
        target[key] = (typeof current === 'number' ? current : 0) + value;
        continue;
      }

      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        const current = target[key];

        if (
          typeof current !== 'object' ||
          current === null ||
          Array.isArray(current)
        ) {
          target[key] = {};
        }

        merge(target[key], value);
        continue;
      }

      target[key] = value;
    }
  }

    merge(result, extra);
    return result;
}

