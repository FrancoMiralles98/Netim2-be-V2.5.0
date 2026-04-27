import { ZoneNames } from "src/modules/gameData/types/zone-names.type";

/**
 * Representa el progreso de descubrimiento del personaje por ubicación.
 *
 * @description
 * Cada clave corresponde a una ubicación del juego y su valor indica
 * los puntos de descubrimiento acumulados en dicha zona.
 * estos puntos se logran conseguir cuando derrotas por primera vez al ultimo mob
 * que tengas disponible, aca solo se aplica a nombres de las "zonas abiertas", no se
 * incluye las dungeons
 * 
 * @example
 * {
 *   Desierto: 10,
 *   Yongbi: 5
 * }
 *
 */
export type DiscoveryWorld = Record<ZoneNames,number>


