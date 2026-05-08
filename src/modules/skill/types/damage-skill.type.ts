import { BonusRefKeys } from "src/modules/bonus/types/bonusListHelper/ref-bonus-name.type";
import { BaseSkill } from "./base-skill.type";
import { TierDescription } from "./bonus-damage-config.type";

/**
 * Representa una skill de tipo Daño.
 *
 * @description
 * Las DamageSkills son habilidades que infligen daño directo al objetivo,
 * pudiendo además aplicar efectos secundarios y bonus adicionales según
 * la configuración de la skill.
 *
 * Extiende {@link BaseSkill}
 *
 * @property {'ad' | 'ap'} tipo_daño
 * Tipo de daño que realiza la skill:
 * - 'ad' → escala con el ataque físico del personaje
 * - 'ap' → escala con el ataque mágico del personaje
 *
 * @property {number} cd
 * Tiempo de enfriamiento (cooldown) en segundos para volver a usar la skill.
 *
 * @property {SkillBonusEffectList} bonus_efecto
 * Define los efectos secundarios que puede aplicar la skill.
 *
 * @description
 * Cada clave representa un tipo de efecto (según {@link SkillBonusEffectKeys})
 * y su valor indica la probabilidad o magnitud del efecto.
 *
 * @example
 * bonus_efecto: { incendio: 20 }
 * → 20% de probabilidad de aplicar incendio
 *
 * @note
 * Algunos efectos pueden no representar probabilidad sino valores directos
 * (ej: penetracion_habilidad).
 *
 * @property {number} bonus_damage
 * Probabilidad de aplicar un bonus adicional de daño.
 *
 * @description
 * El significado exacto depende de la skill.
 *
 * @example
 * Si bonus_damage = 10:
 * → 10% de probabilidad de activar un efecto especial de daño
 *
 * @note
 * El valor del bonus aplicado depende de la lógica específica de cada skill.
 *
 * @property {[number, number]} daño
 * Rango de daño de la skill:
 * - índice 0 → daño mínimo
 * - índice 1 → daño máximo
 */
export interface DamageSkillType extends BaseSkill {
   type: 'Daño';
   tipo_daño: 'ad' | 'ap';
   cd: number;
   bonus_efecto: SkillBonusEffectList;
   bonus_damage?: SkillBonusDamage;
   daño: { min: number, max: number };
}


export type SkillBonusEffectList = Record<SkillBonusEffectKeys, number>

/**
 * Los posibles efectos que pueden causar las habilidades
 * 
 * @property {number} desmayo 
 * chances de hacer que el adversario sea incapaz de realizar acciones por x cantidad de turnos 
 * @property {number} incendio
 * chances de realizar daño continuo en base al daño realizado por la skill
 * @property {number} retardo 
 * chances de realizar efecto de relantizacion a su velocidad de ataque y velocidad de movimiento
 * @property {number} veneno 
 * chances de realizar daño continuo en base al daño realizado por la skill
 * @property {number} sangrado 
 * chances de realizar daño continuo en base al daño realizado por la skill y velocidad de movimiento del adversario
 * @property {number} penetracion_habilidad 
 * el porcentaje de reduccion de defensas al adversario para ese ataque en especifico que tiene la skill
 */
export type SkillBonusEffectKeys = Extract<BonusRefKeys,
   'desmayo' | 'incendio' | 'retardo' | 'veneno' | 'sangrado' | 'penetracion_habilidad'>

   
export type SkillBonusDamage = TierBonusDamage | ChanceBonusDamage


export interface TierBonusDamage {
   type: 'tier',
   value: TierDescription["damageConfig"]
}

export interface ChanceBonusDamage {
   type: 'chance'
   value: number;
}
