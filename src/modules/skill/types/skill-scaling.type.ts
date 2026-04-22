import { CharacterAttribute, CharacterSpeciality } from "src/modules/character/types/characterProps/character-stats.type";
import { SkillBonusEffectKeys } from "./damage-skill.type";
import { BonusRefKeys } from "src/modules/bonus/types/bonusListHelper/ref-bonus-name.type";
import { UNIQUE_ID_SKILLS } from "./unique-id-skill.enum";

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
 *
 * @property {boolean} escaladoBonusDamage
 * Indica si la skill posee un bonus especial de daño adicional.
 *
 * @description
 * Este valor no define el cálculo en sí, sino si la skill aplica lógica extra
 * de daño (por ejemplo, habilidades con daño crítico adicional o multiplicadores especiales).
 */
export interface SkillDamageEscalado {
    escaladoMain: {min: number,max: number}; 
    escaladoLv: SkillScalingLv 
    escaladoAtributos: Partial<Record<CharacterAttribute,number>>;
    escaladoEfecto: Record<SkillBonusEffectKeys,SkillScalingEffect>
    escaladoBonusDamage: boolean;
}

/**
 * Representa el escalado de una skill basado en su nivel y rango.
 *
 * @property {number} perLv
 * Valor base que se multiplica por el nivel de la skill.
 *
 * @example
 * Si perLv = 2:
 * - lv 16  → 2 * 16 = 32
 * - M5     → 2 * 21 = 42 (16 + 5 niveles de master)
 *
 * @property {number} basicMulti
 * Multiplicador aplicado a skills no masterizadas (nivel ≤ 16).
 *
 * @property {number} masterMulti
 * Multiplicador aplicado a skills en rango Master (M1–M10).
 *
 * @property {number} grandMasterMulti
 * Multiplicador aplicado a skills en rango Grand Master (G1–G10).
 *
 * @property {number} perfectMulti
 * Multiplicador aplicado a skills en rango Perfect (P).
 *
 * @note
 * El cálculo final suele ser:
 * (perLv * nivel) * multiplicador según rango
 */
export interface SkillScalingLv {
    perLv: number,
    basicMulti: number,
    masterMulti: number,
    granMasterMulti: number,
    perfectMulti: number
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
    base:number,perLv:number
}

/**
 * Define los escalados aplicados a las skills de tipo Aura.
 *
 * @property {Partial<Record<CharacterAttribute, number>>} escaladoAtributos
 * Porcentaje de los atributos del personaje que se utilizan para potenciar los buffos.
 *
 * @description
 * Cada atributo indicado aporta un porcentaje de su valor total,
 * el cual se usa como % adicional sobre el valor final del buffo.
 *
 * @example
 * Si el personaje tiene:
 * - INT = 100
 * - escaladoAtributos = { INT: 10 }
 *
 * Entonces:
 * → se toma un 10% de INT (10)
 *
 * @note
 * El calculo de atributo aplicado es igual a como si fuera una skill de daño 
 *
 * @property {Partial<Record<BonusRefKeys, EscaladoBuffos>>} escaladoBuffos
 * Define el escalado individual de cada buffo que puede otorgar la aura.
 *
 * @description
 * Cada clave representa un tipo de bonus (ej: critico, def_media, etc.)
 * y su valor define cómo escala ese buffo en función del nivel y atributos.
 */

export interface SkillAuraEscalado {
    escaladoAtributos: Partial<Record<CharacterAttribute,number>>; //es el % del atributo, es poco porque despues se usa como multiplicativo
    escaladoBuffos: Partial<Record<BonusRefKeys,EscaladoBuffos>>
}

/**
 * Define cómo escala un buffo específico dentro de una AuraSkill.
 *
 * Extiende {@link SkillScalingLv}, agregando la posibilidad de
 * escalar también con atributos del personaje.
 *
 * @property {boolean} scaleWithAtribute
 * Indica si el buffo utiliza el escalado por atributos (`escaladoAtributos`)
 * en su cálculo final.
 *
 * @description
 * - true  → el buffo escala con atributos + nivel
 * - false → el buffo escala únicamente con el nivel de la skill
 *
 */
export type EscaladoBuffos =  SkillScalingLv & {
    scaleWithAtribute: boolean;
}

/**
 * Estrucutura de las (const) listas de escalados de las skills para las clases 
 */
export type StructureCharacterSkillScaling =
Partial<Record<CharacterSpeciality,Partial<Record<UNIQUE_ID_SKILLS,SkillDamageEscalado|SkillAuraEscalado>>>>