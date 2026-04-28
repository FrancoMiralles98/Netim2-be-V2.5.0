import { DiscoveryWorld } from "../../types/baseCharacterProps/discovery-world.type";

/**
 * Estructura base del descubrimiento de mobs en cada zona al comenzar con un personaje
 * No se ponen "Mazmorra de Monos, "Cueva de Arañas" y "Torre Demoniaca" porque estos entran
 * en la categoria de "dungeons" y no la de "mundo abierto"
 */
export const BASE_DISCOVERY_WORLD: Partial<DiscoveryWorld> = {
    city1: 0,
    city2: 0,
    desierto: 0,
    montaña: 0,
    templo: 0,
    valle: 0
}