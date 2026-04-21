/**
 * Información del gremio asociado al personaje.
 *
 * @description
 * Contiene los datos básicos del gremio y el estado del personaje respecto a él.
 *
 * @property {string} gremio_name
 * Nombre del gremio.
 *
 * @property {string} gremio_tag
 * Tag o identificador corto del gremio.
 *
 * @property {number} gremio_left_at
 * Timestamp que indica cuándo el personaje abandonó el gremio.
 * para cooldowns o restricciones de reingreso.
 */
export interface GremioOptions {
    gremio_name: string;
    gremio_tag: string;
    gremio_left_at: number;
}