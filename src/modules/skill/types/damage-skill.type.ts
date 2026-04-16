import { BonusRefKeys } from "src/modules/bonus/types/bonusListHelper/ref-bonus-name.type";
import { BaseSkill } from "./base-skill.type";

/**
 * @description - tipo de los datos especificos que tiene SkillDamage 
 * se exiende de @extends {@see BaseSkill}
 * @property {'ad' | 'ap'} tipo_daño : el tipo de daño que hace la skill
 * @property {number} cd : el tiempo de enfriamiento de la skill para volver a usarse en combate
 * @property {'Daño'} tipo - si es skill de daño tiene que tener como tipo 'Daño'
 * @property {SkillBonusEffectList} bonus_efecto - Hay ciertas skill que tienen chances de ocasionar
 * efectos secundarios, estos efectos pueden causar daño prolongado o efectos de estado, como relantizaciones
 * @see {SkillBonusEffectKeys} 
 * @property {number} bonus_damage: hay ciertas skills que tiene chances de potenciar su daño, dependiendo
 * de cada skill ese numero significara un bonificador
 *  @example - si la es 'Emboscada' y el valor de 'bonus_damage' es 10, quiere decir que tiene un 10%
 *  de que la skill obtenga un 40% de daño aumentado
 *  en otras habilidades este numero puede significar otra cosa
 * @property {[number,number]} daño - daño minimo y daño maximo que puede realizar la skill
 */
export interface DamageSkill extends BaseSkill {
    tipo_daño: 'ad' | 'ap';
    cd: number;
    bonus_efecto: SkillBonusEffectList;
    bonus_damage: number;
    daño: [number,number];
}


export type SkillBonusEffectList = Record<SkillBonusEffectKeys,number>

/**
 * @description - los posibles efectos que pueden causar las habilidades
 * @property {number} desmayo - chances de hacer que el adversario sea incapaz de realizar acciones por x cantidad de turnos 
 * @property {number} incendio- chances de realizar daño continuo en base al daño realizado por la skill
 * @property {number} retardo - chances de realizar efecto de relantizacion a su velocidad de ataque y velocidad de movimiento
 * @property {number} veneno - chances de realizar daño continuo en base al daño realizado por la skill
 * @property {number} sangrado - chances de realizar daño continuo en base al daño realizado por la skill y velocidad de movimiento del adversario
 * @property {number} penetracion_habilidad - el porcentaje de reduccion de defensas al adversario para ese ataque en especifico que tiene la skill
 */
export type SkillBonusEffectKeys = Extract<BonusRefKeys,
 'desmayo' | 'incendio' | 'retardo' | 'veneno' | 'sangrado' | 'penetracion_habilidad'>