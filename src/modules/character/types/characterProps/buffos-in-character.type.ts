/**
 * Representa un buffo activo aplicado a un personaje.
 *
 * @description
 * Contiene la información necesaria para calcular su efecto y mostrarlo en cliente.
 *
 * @property {string} bonus_ref_name
 * nombre de de referencia del bonus que modifica
 *
 * @property {number} bonus_value
 * Valor del bonus que aplica el buffo.
 *
 * @property {number} buff_duration
 * Duración total del buffo en segundos.
 *
 * @property {number} buff_base_duration
 * Duración original del buffo (sin modificaciones).
 *
 * @property {number} id_buff
 * Identificador único del buffo.
 *
 * @property {number} buff_inicialization
 * Timestamp del momento en que se aplicó el buffo.
 *
 * @property {string} buff_icon
 * Ruta o URL del icono del buffo.
 *
 * @property {string} buff_description
 * Descripción del efecto del buffo.
 *
 * @property {string} buff_name
 * Nombre del buffo.
 */
export interface AppliedBuffos {
  bonus_ref_name: string;
  bonus_value: number;
  buff_duration: number;
  buff_base_duration: number;
  id_buff: number;
  buff_inicialization: number;
  buff_icon: string;
  buff_description: string;
  buff_name: string;
}