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

export type CharacterAttribute = Extract<BonusRefKeys, 'VIT' | 'INT' | 'STR' | 'DEX'>

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
export interface CharacterAttributeValue {
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
export interface CharacterStats {
  general: {
    VIT: CharacterAttributeValue;
    INT: CharacterAttributeValue;
    STR: CharacterAttributeValue;
    DEX: CharacterAttributeValue;
    hp: {actual:number, max: number};
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
  };
  fight: CharacterFightProps
}

/**
 * Estadísticas generales del personaje durante un combate.
 *
 * @description
 * Contiene valores acumulados y métricas de desempeño
 * generadas a lo largo de una pelea.
 */
export interface CharacterFightProps {
  ad_realizado: number;
  ap_realizado: number;
  critico_realizado: number;
  penetracion_realizado: number;
  doble_golpe_realizado: number;
  ad_ataque_basico: number;
  ataque_basico_realizado: number;
  veneno_realizado: number;
  veneno_aplicado: number;
  incendio_realizado: number;
  incendio_aplicado: number;
  sangrado_aplicado: number;
  sangrado_realizado: number;
  curacion_cortada: number;
  reflejo_realizado: number;
  reflejo_aplicado: number;
  ad_mitigado: number;
  ap_mitigado: number;
  vida_curada: number;
  ataque_bloqueado: number;
  ataque_esquivado: number;
  retardo_aplicado: number;
  flecha_esquivado: number;
  ataque_anulado: number;
  turno_anulado: number;
  skills_used: SkillDamageInFightStats[];
}

/**
 * Estadísticas registradas de una skill de daño durante un combate.
 *
 * @property {boolean} isLearned
 * Indica si la skill está aprendida por el personaje.
 *
 * @property {number} cdSkill
 * Cooldown actual de la skill durante el combate.
 *
 * @property {number} maxDmg
 * Mayor daño realizado por la skill de las veces usadas
 * 
 * @property {number} timesUsed
 * Cantidad de veces que la skill fue utilizada.
 *
 * @property {number} Dps
 * Daño por segundo registrado para la skill.
 *
 * @property {number} idSkill
 * ID único de la skill.
 */
export interface SkillDamageInFightStats {
  isLearned: boolean;
  cdSkill: number;
  maxDmg: number;
  timesUsed: number;
  Dps: number;
  idSkill: number;
}
