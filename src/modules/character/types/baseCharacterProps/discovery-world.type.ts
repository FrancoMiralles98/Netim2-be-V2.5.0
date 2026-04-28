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
 * @note - hay ciertos mobs que son de una dificultad un poco mayor (nivel 2), al ser mas dificiles
 * no solo se habilita este mob sino el siguiente tambien si el siguiente mob es de una dificultad menor
 * (nivel 1) asi puede seguir mejorando el personaje sin estancarse en un mob que es mas dificil que la media
 * y ademas le da una motivacion para mejorar equipo y vencer a este mob que es mas dificil
 * 
 * @example
 * {
 *   Desierto: 10,
 *   Yongbi: 5
 * }
 *
 */
export type DiscoveryWorld = Record<ZoneNames,number>


