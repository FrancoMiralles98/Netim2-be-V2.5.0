/**
 * Representa un registro del historial del personaje.
 *
 * @description
 * Contiene información básica de las batallas que tuve, (esta es la informacion 
 * que aparece en la pestaña "Historial" en el cliente)
 *
 * @property {string} filtro
 * Tipo de pelea que tuve, si fue PvP o PvM
 *
 * @property {number} numeroDeBatalla
 * número de la batalla 
 *
 * @property {string} enemigo
 * Nombre del enemigo enfrentado.
 *
 * @property {number} fecha
 * Timestamp del momento en que ocurrió el evento.
 *
 * @property {boolean} reward
 * Indica si aun quedan recompensas por reclamar 
 */
export interface HistorialInUser {
    filtro: 'pvp' | 'pvm';
    numeroDeBatalla: number;
    enemigo: string;
    fecha: number;
    reward: boolean;
}