import { UNIQUE_ID_SKILLS } from "src/modules/skill/types/props/unique-id-skill.enum";

/**
 * Estadísticas generales del personaje durante un combate.
 *
 * @description
 * Contiene valores acumulados y métricas de desempeño
 * generadas a lo largo de una pelea.
 */
export interface FightDetails {
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
  skills_used: SkillDamageInFight[];
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
export interface SkillDamageInFight {
  isLearned: boolean;
  cdSkill: number;
  maxDmg: number;
  timesUsed: number;
  Dps: number;
  idSkill: UNIQUE_ID_SKILLS;
}
