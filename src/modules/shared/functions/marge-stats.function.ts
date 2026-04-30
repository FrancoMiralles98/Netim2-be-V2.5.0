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
export const mergeStats = (
    base: CharacterStats | MobStats,
    extra: Partial<CharacterStats | MobStats>
): CharacterStats | MobStats => {
    const result = structuredClone(base);

    function merge(target: CharacterStats | MobStats, source: Partial<CharacterStats | MobStats>) {
        for (const key in source) {
            const value = source[key];

            if (value === undefined) continue;

            if (typeof value === 'number') {
                target[key] = (target[key] ?? 0) + value;
            } else if (
                typeof value === 'object' &&
                value !== null
                && !Array.isArray(value)
            ) {
                merge(target[key], value);
            } else {
                target[key] = value;
            }
        }
    }

    merge(result, extra);
    return result;
}

