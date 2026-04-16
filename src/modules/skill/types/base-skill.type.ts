import { MasteryLvRank } from "./skill-lv-rank.types";

/**
 * @description - Estrucutra base de las propiedades de las skill de cualquier raza
 * @property {string} nombre - nombre completo de la skill 
 * @property {number | @see MasteryLvRank} lv - nivel de la skill, que va del lv 1 al 17 y despues esta
 * skill se masteriza y pasa a ser string M1..M10..G1 hasta el P
 * @property {number} idPosition - este id hace referencia a la posición que se encuentra en la lista de skill
 * ya que cada skill tiene una posicion fija , sirve mas que nada para identificar el icono de la skill
 * @property {'Daño' | 'Aura'} tipo - cual es el tipo de skill 
 * @property {IconPisition} icon - posicion que se utiliza en el cliente para saber cual posicion es la correcta
 * del icono de la skill, porque dependiendo del nivel que tenga el icono va cambiado 
 *  @example - cuando la skill pasa del lv 17 => M1 , el icono cambia , tambien de M10 => G1 y de G10 => P 
 * @property {string} descripcion - descripcion breve de lo que hace la skill
 * @property {number} idSkill - id unico de la skill
 */
export interface BaseSkill {
    nombre: string,
    lv: number | MasteryLvRank,
    idPosition: number,
    tipo: 'Daño' | 'Aura',
    icon: IconPisition,
    descripcion: string,
    idSkill: number,
    escalado: any
}

export interface IconPisition {
    x: number,
    y: number
}