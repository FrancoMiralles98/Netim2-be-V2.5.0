import { BonusRefKeys } from "src/modules/bonus/types/bonusListHelper/ref-bonus-name.type";
import { BaseSkill } from "./base-skill.type";

/**
 * @description - tipo de los datos especificos que tiene AuraSkill se exiende de @extends {@see BaseSkill}
 *  @property {'Aura'} tipo - tienen que tener el tipo espeficio de 'Aura'
 *  @property {Record<BonusRefKeys,number>} buffos - se usa como key los @see {@see BonusRefKeys} para 
 * identificar despues cual es el potenciador que hace dicho buffo
 * @example - en buffos puede aparecer criticos: 10, eso quiere decir que agrega un 10% a las chances de 
 * hacer critico 
 */
export interface AuraSkill extends BaseSkill {
    buffos: Partial<Record<BonusRefKeys,number>>
}
