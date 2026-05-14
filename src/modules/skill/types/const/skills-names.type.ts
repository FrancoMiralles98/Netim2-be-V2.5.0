import { LetterMasteryLv } from "../config/letter-mastery-lv.type";
import { UNIQUE_ID_SKILLS } from "../props/unique-id-skill.enum";

/**
 * Configuración de nombres de skills organizados por `idSkill`.
 *
 * Cada entrada representa una skill específica y contiene
 * los nombres que tendrá según su tier de maestría.
 *
 * Se utiliza para:
 * - Actualizar automáticamente el nombre visual de la skill
 * - Reflejar cambios de evolución de mastery
 * 
 */
export type SkillsNamesType = Partial<Record<UNIQUE_ID_SKILLS,NamesByTierMasteryLv>>

/**
 * Representa los nombres disponibles de una skill
 * según su tier de maestría.
 *
 * Cada key corresponde a un rango de mastery:
 *
 * - N = Skill no masterizada (lv 1 al 16)
 * - M = Master
 * - G = Gran Master
 * - P = Perfect
 *
 * El sistema utiliza esta estructura para cambiar
 * automáticamente el nombre de la skill cuando
 * aumenta su mastery level.
 */
export type NamesByTierMasteryLv  = Record<LetterMasteryLv | 'N',string>
