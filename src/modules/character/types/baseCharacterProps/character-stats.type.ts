import { BonusCCRefKeys, BonusDañoRefKeys, BonusDefensaRefKeys, BonusMiscsRefKeys, BonusRefKeys } from "src/modules/bonus/types/bonusListHelper/ref-bonus-name.type"

/**
 * Especialidades disponibles para cada raza del personaje.
 */
export type CharacterSpeciality =
  'MagiaNegra' |
  'Espejo' |
  'Corporal' |
  'Mental' |
  'Daga' |
  'Flecha' |
  'Luz' |
  'Dragon'

/**
* Razas jugables del juego.
*/
export type CharacterRace =
  'chaman' |
  'ninja' |
  'guerrero' |
  'sura'

/**
 * Valor de un atributo del personaje.
 *
 * @property {number} lvPoints
 * Puntos asignados manualmente por subida de nivel.
 *
 * @property {number} bonusPoints
 * Puntos obtenidos mediante items, skills, buffos u otras fuentes externas.
 * 
 * @note 
 * Se hace una separacion porque tiene un limite de puntos que se pueden subir por nivel (lvPoints)
 */
export interface AttributeValue {
  lvPoints: number,
  bonusPoints: number
}

/**
 * Estructura general de estadísticas del personaje.
 *
 * @description
 * Agrupa los datos principales del personaje:
 * - estadísticas generales
 * - habilidades
 * - bonus adicionales
 * - estadísticas acumuladas de combate
 */
export interface Stats {
  general: {
    hp: { actual: number, max: number };
    regen_hp: number;
    def: number;
    vh: number;
    va: number;
    vm: number;
    ad: { min: number, max: number };
    ap: { min: number, max: number };
  };
  bonus: {
    daño: Record<BonusDañoRefKeys, number>
    defensa: Record<BonusDefensaRefKeys, number>
    cc: Record<BonusCCRefKeys, number>;
    miscs: Record<BonusMiscsRefKeys, number>
  }
}


