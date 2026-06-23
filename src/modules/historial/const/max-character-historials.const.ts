/**
 * Cantidad máxima de historiales que puede almacenar un personaje
 * para cada tipo de combate.
 *
 * Este límite se aplica de forma independiente a los historiales
 * de PvP y PvM.
 *
 * Cuando se supera la cantidad máxima permitida para un tipo de combate,
 * se eliminará automáticamente el registro más antiguo de dicho
 * historial para mantener únicamente los combates más recientes.
 */
export const MAX_CHARACTER_HISTORIALS_BY_FILTRO = 10