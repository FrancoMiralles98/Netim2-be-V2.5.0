import { DiscoveryWorld } from "../../types/characterProps/discovery-world.type";

/**
 * No se ponen "Mazmorra de Monos, "Cueva de Arañas" y "Torre Demoniaca" porque al ser nombre
 * de ubicaciones, estos son mazmorras, no "mundo abierto"
 */
export const BASE_DISCOVERY_WORLD: Partial<DiscoveryWorld> = {
    city1: 0,
    city2: 0,
    desierto: 0,
    montaña: 0,
    templo: 0,
    valle: 0
}