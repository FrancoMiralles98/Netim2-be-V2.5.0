/**
 * Representa el progreso de estrellas desbloqueadas por mob.
 *
 * @description
 * Cada registro indica qué recompensas especiales están disponibles
 * para un mob específico
 *
 * @property {number} id_mob
 * Identificador único del mob.
 *
 * @property {boolean} yang_star_available
 * Indica si la estrella de recompensa de yang está disponible.
 *
 * @property {boolean} exp_star_available
 * Indica si la estrella de recompensa de experiencia está disponible.
 *
 * @property {boolean} object_rarity_star_available
 * Indica si la estrella de recompensa de rareza de objetos está disponible.
 * 
 * @note - que hace cada cosa se especifica en el modulo de "Drop"
 */
export interface StarDiscovery {
    id_mob: number;
    yang_star_available: boolean;
    exp_star_available: boolean;
    object_rarity_star_available: boolean;
}