import { SkillBonusEffectKeys } from "../props/damage-skill.type";
import { SkillBaseEscalado, SkillScalingLv } from "./skill-base-escalado.type";

/**
 * Define todos los escalados que afectan a una skill de tipo daño.
 *
 * Estos valores determinan cómo se calcula el daño final de la habilidad
 * en función de:
 * - daño base del personaje
 * - nivel de la skill
 * - atributos del personaje
 * - efectos secundarios
 *
 * @property {{min:number,max:number}} escaladoMain
 * Multiplicador base de la skill aplicado sobre el daño del personaje.
 *
 * @description
 * - Si la skill es de tipo 'ad', escala con el ataque físico
 * - Si la skill es de tipo 'ap', escala con el ataque mágico
 *
 * @example
 * Si el personaje tiene 100 de daño y escaladoMain = { min: 0.8, max: 1.2 }:
 * - daño mínimo → 100 * 0.8 = 80
 * - daño máximo → 100 * 1.2 = 120
 * 
 *  @property {number} cd
 *  El cd de la habilidad
 *
 * @property {@link SkillScalingLv} escaladoLv
 * Escalado del daño en función del nivel y rango de la skill.
 *
 * @property {Partial<Record<CharacterAttribute, number>>} escaladoAtributos
 * Porcentaje de los atributos del personaje que se convierten en daño adicional.
 *
 * @description
 * Cada atributo indicado aporta un porcentaje de su valor total al daño final.
 *
 * @example
 * Si el personaje tiene:
 * - VIT = 100
 * - escaladoAtributos = { VIT: 20 }
 *
 * Entonces:
 * - se toma el 20% de VIT → 20
 * - ese valor aumenta (como porcentaje) el daño final de la skill
 *
 * @property {@link SkillScalingEffect  Record<SkillBonusEffectKeys, SkillScalingEffect>} escaladoEfecto
 * Define cómo escalan los efectos secundarios de la skill (veneno, incendio, etc.).
 */
export interface SkillDamageEscalado extends SkillBaseEscalado {
    type: 'damage';
    escaladoMain: { min: number, max: number };
    cd: number;
    escaladoLv: SkillScalingLv
    escaladoEfecto: Record<SkillBonusEffectKeys, SkillScalingEffect>
}

/**
 * Define cómo escala un efecto secundario de una skill
 * (como veneno, incendio, desmayo, etc.).
 *
 * @property {number} base
 * Valor inicial del efecto en nivel 1.
 *
 * @example
 * Si base = 20 en "incendio":
 * → la skill tiene 20% de probabilidad de aplicar incendio en nivel 1
 * 
 * @note
 * Excepción:
 * - `penetracion_habilidad` NO representa una probabilidad
 * - Representa un porcentaje de reducción de resistencias del objetivo
 *   frente a esa habilidad específica.
 *
 * @example
 * Si penetracion_habilidad = 20:
 * → reduce un 20% de la resistencia del enemigo frente a esa skill
 *
 * @property {number} perLv
 * Incremento del efecto por cada nivel de la skill.
 *
 * @example
 * Si:
 * - base = 20
 * - perLv = 1
 * - skill = nivel 16
 *
 * Entonces:
 * → valor final = 20 + (1 * 15) = 35%
 */
export interface SkillScalingEffect {
    base: number, perLv: number
}