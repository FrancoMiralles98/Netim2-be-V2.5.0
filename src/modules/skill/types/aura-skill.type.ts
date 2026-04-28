import { BonusRefKeys } from "src/modules/bonus/types/bonusListHelper/ref-bonus-name.type";
import { BaseSkill } from "./base-skill.type";

/**
 * Representa una skill de tipo Aura.
 *
 * @description
 * Las AuraSkills no infligen daño directo, sino que aplican buffos
 * que modifican las estadísticas del personaje (ej: crítico, defensa, velocidad, etc.).
 *
 * Extiende {@link BaseSkill}, manteniendo todas las propiedades comunes
 *
 * @property {Partial<Record<BonusRefKeys, number>>} buffos
 * Define los bonus que aplica la skill y su valor correspondiente.
 *
 * @description
 * - Cada clave representa un tipo de bonus (según {@link BonusRefKeys})
 * - Cada valor representa la magnitud del efecto aplicado
 *
 * @example
 * buffos: { critico: 10}
 *
 * → Incrementa un 10% la probabilidad de golpe crítico
 */
export interface AuraSkillType extends BaseSkill {
    buffos: Partial<Record<BonusRefKeys,number>>
}
