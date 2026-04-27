/**
 * Configuración de disponibilidad de sets de equipo del personaje.
 *
 * @description
 * Cada propiedad indica si el personaje tiene habilitado el uso de ese set de equipo.
 *
 * @property {boolean} equipo1_on
 * Indica si el set de equipo 1 está disponible. (ya disponible por default)
 *
 * @property {boolean} equipo2_on
 * Indica si el set de equipo 2 está disponible. (se condigue mediante yang)
 *
 * @property {boolean} equipo3_on
 * Indica si el set de equipo 3 está disponible. (se consigue mediante md)
 *
 * 
 */
export interface EquipoOptions {
    equipo1_on: boolean;
    equipo2_on: boolean;
    equipo3_on: boolean;
}