import { SkillBonusDamage } from "src/modules/skill/types/props/damage-skill.type";

export type ActionAttackerType =
    SkillDmgDescriptionType |
    BasicAttackDescriptionType |
    HealingDescriptionType

/**
 * Resultado ofensivo de una habilidad de daño.
 *
 * @property {'skill'} type_action - Identificador de acción de habilidad ofensiva.
 *
 * @property {number} idSkill - ID único de la habilidad utilizada.
 *
 * @property {'ad' | 'ap'} type_damage - Tipo de daño de la habilidad.
 * Puede ser daño físico (ad) o mágico (ap).
 *
 * @property {number} cd - El cd base que tiene la skill (luego puede disminuir por vh o aumentar por retardo 
 * a la hora de aplicar el cd correspondiente)
 *
 * @property {SkillBonusDamage} [bonus_damage] - Información adicional de bonus de daño de la habilidad.
 *
 * @property {number} dmg - Daño total generado por la habilidad (antes de que pase por las defensas del defensor).
 *
 * @property {{
 * idSkill: number;
 * cd: number;
 * dmgBonificated: number;
 * bonusToAdd: number;
 * }} [potentialSkill] - Informacion cuando la habilidad recibio una bonificacion de otra habilidad
 * en este caso el unico que hace esto por ahora es la skill "Camuflaje"
 */
export interface SkillDmgDescriptionType {
    type_action: 'skill',
    idSkill: number;
    type_damage: 'ad' | 'ap'
    cd: number;
    bonus_damage?: SkillBonusDamage;
    dmg: number;
    effectsChances: {
        veneno: boolean; //si el valor es booleano indica si se aplica dicho efecto
        incendio: boolean;
        sangrado: boolean;
        critico: boolean;
        vampirismo_hechizo: number; //si es un valor fijo, se utilizara para calculo segun el bonus que sea
        desmayo: boolean;
        retardo: boolean;
        penetracion_habilidad: number
    },
    potentialSkill?: {
        idSkill: number;
        cd: number;
        dmgBonificated: number; //valor del  daño extra que agrego a la skill
        bonusToAdd: number; //indica la cantidad de extra de daño que otorga dicha habilidad
    }
}

/**
 * Resultado ofensivo de un ataque básico.
 *
 * @property {'basic_attack'} type_action - Identificador de ataque básico.
 *
 * @property {number} dmg - Daño total generado por el ataque básico (antes de que pase por las defensas del defensor)
 *
 * @property {boolean} missHit - Indica si el ataque falló.
 *
 * @property {boolean} doble_golpe - Indica si el ataque activó doble golpe.
 *
 * @property {{
 * veneno: boolean;
 * incendio: boolean;
 * sangrado: boolean;
 * critico: boolean;
 * desmayo: boolean;
 * penetracion: boolean;
 * retardo: boolean;
 * }} effectsChances - Resultado de chances y efectos especiales aplicados por el ataque básico.
 */
export interface BasicAttackDescriptionType {
    type_action: 'basic_attack'
    dmg: number;
    missHit: boolean;
    doble_golpe: boolean;
    effectsChances: {
        veneno: boolean; 
        incendio: boolean;
        sangrado: boolean;
        critico: boolean;
        desmayo: boolean;
        penetracion: boolean;
        retardo: boolean;
    }
}

/**
 * Resultado ofensivo de una habilidad de curación.
 *
 * @property {'healing'} type_action - Identificador de acción de curación.
 *
 * @property {{
 * critico: boolean;
 * }} effectsChances - Resultado de efectos especiales aplicados a la curación.
 *
 * @property {number} healing - Cantidad total de HP restaurado (antes de pasar por los efectos del defensor)
 *
 * @property {number} idSkill - ID único de la habilidad de curación utilizada.
 *
 * @property {number} cd - El cd base que tiene la skill (luego puede disminuir por vh o aumentar por retardo 
 * a la hora de aplicar el cd correspondiente)
 */
export interface HealingDescriptionType {
    type_action: 'healing'
    effectsChances: {
        critico: boolean;
    }
    healing: number;
    idSkill: number;
    cd: number
}