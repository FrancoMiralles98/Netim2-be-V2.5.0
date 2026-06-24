import { IdMissionsList } from "../idMissions/id-mission-list.enum";

/**
 * Configuración de experiencia para un grupo de misiones.
 *
 * Permite agrupar varias misiones y asignarles un mismo porcentaje
 * de experiencia base.
 *
 * El valor de `exp` representa un porcentaje sobre la experiencia total
 * correspondiente al nivel de la misión. Por ejemplo, si una misión es
 * de nivel 10 y `exp` es `25`, la recompensa será el 25% de la experiencia
 * total requerida para ese nivel.
 *
 * @property idMissions Lista de IDs de misiones que comparten esta configuración de experiencia.
 * @property exp Porcentaje de experiencia que otorgarán las misiones respecto al nivel correspondiente.
 */
export interface ExpMissionsConfig {
    idMissions: IdMissionsList[],
    exp: number
}