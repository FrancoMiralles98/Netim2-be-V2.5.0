import { BonusRefKeys } from "src/modules/bonus/types/bonusListHelper/ref-bonus-name.type";
import { SkillBaseEscalado, SkillScalingLv } from "./skill-base-escalado.type";

/**
 * Define los escalados aplicados a las skills de tipo Aura.
 * 
 * @property {Partial<Record<BonusRefKeys, EscaladoBuffos>>} escaladoBuffos
 * Define el escalado individual de cada buffo que puede otorgar la aura.
 *
 * @description
 * Cada clave representa un tipo de bonus (ej: critico, def_media, etc.)
 * y su valor define cómo escala ese buffo en función del nivel y atributos.
 */

export interface SkillAuraEscalado extends SkillBaseEscalado {
    type: 'aura';
    escaladoBuffos: Partial<Record<BonusRefKeys, EscaladoBuffos>>
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
export type EscaladoBuffos = {
    escaladoLv: SkillScalingLv
    scaleWithAtribute: boolean;
}