import { SkillAuraEscalado } from "../config/skill-aura-escalado.type";
import { SkillDamageEscalado } from "../config/skill-damage-escalado.type";
import { MasteryLvRank } from "./skill-lv-rank.types";
import { UNIQUE_ID_SKILLS } from "./unique-id-skill.enum";

/**
 * Estructura base que representa una skill del juego,
 * independientemente de su tipo (Daño o Aura).
 *
 * @property {string} nombre
 * Nombre completo de la skill.
 *
 * @property {number | MasteryLvRank} lv
 * Nivel actual de la skill.
 *
 * @property {number} idPosition
 * Posición fija de la skill dentro del listado de habilidades de la clase.
 * @description
 * Se utiliza principalmente para determinar la ubicación del icono
 * dentro del spritesheet en el cliente.
 *
 * @property {'Daño' | 'Aura'} tipo
 * Tipo de skill:
 * - 'Daño' → habilidades que infligen daño
 * - 'Aura' → habilidades que aplican buffos
 *
 * @property {IconPosition} icon
 * Coordenadas del icono dentro del spritesheet.
 *
 * @property {string} descripcion
 * Descripción breve de la habilidad.
 *
 * @property {UNIQUE_ID_SKILLS} idSkill
 * Identificador único de la skill dentro del sistema.
 *
 * @property {SkillAuraEscalado | SkillDamageEscalado} escalado
 * Configuración de escalado de la skill.
 */
export interface BaseSkill {
    nombre: string,
    lv: number | MasteryLvRank,
    idPosition: number,
    icon: IconPisition,
    descripcion: string,
    idSkill: UNIQUE_ID_SKILLS,
    escalado?: SkillAuraEscalado | SkillDamageEscalado
}

export interface IconPisition {
    x: number,
    y: number
}