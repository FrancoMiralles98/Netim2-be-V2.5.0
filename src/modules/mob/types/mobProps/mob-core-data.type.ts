import type { MobCombatProfile, MobStatsOverrides } from './mob-combat-config.type';
import type { MobType } from './mob.type';

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
export type MobCoreData = Omit<MobType, 'stats' | 'fightConfig'> & {
    /** Perfil de combate. Usa `standard` por defecto. */
    combatProfile?: MobCombatProfile;
    /** Valores finales puntuales del mob, aplicados después de la curva y los modificadores. */
    stats?: MobStatsOverrides;
    /** Configuración de acciones del mob. Usa la configuración base si se omite. */
    fightConfig?: MobType['fightConfig'];
};
