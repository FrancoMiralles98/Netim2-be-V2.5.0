/**
 * Roles disponibles para un personaje dentro del sistema.
 *
 * @description
 * Define el nivel de privilegios o permisos asociados al personaje.
 *
 * @property {'user'} USER
 * Rol estándar del jugador.
 *
 * @property {'admin'} ADMIN
 * Rol con privilegios administrativos.
 *
 * @property {'gm'} GM
 * Rol de Game Master con permisos especiales dentro del juego.
 */
export enum CharacterRole {
    USER = 'user',
    ADMIN = 'admin',
    GM = 'gm'
}