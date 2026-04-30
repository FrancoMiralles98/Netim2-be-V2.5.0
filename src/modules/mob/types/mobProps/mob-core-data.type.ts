import { MobStats } from "./mob-stats.type";
import { MobType } from "./mob.type";

/**
 * Representa la versión core de un mob utilizada para su definición inicial.
 *
 * Propósito:
 * Permitir definir mobs de forma más simple y legible, evitando tener que completar
 * toda la estructura de `MobStats` cuando la mayoría de sus valores son 0 o se calculan dinámicamente.
 *
 * Uso:
 * Este tipo debe ser utilizado para la creación de mobs.
 * Evita redundancia (no escribir múltiples stats en 0).
 * Luego el factory se encargará de generar la estructura completa MobType
 * rellenando los valores faltantes (stats base, progresiones, etc).
 *
 * @see MobType
 * @see MobStats
 */
export type MobCoreData = Omit<MobType, 'stats'> & {
  stats?: Partial<MobStats>;
};