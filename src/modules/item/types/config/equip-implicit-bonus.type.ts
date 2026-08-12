import { BonusRefKeys } from "netim2-shared";
import { PatternScaleType } from "./general-implicit.type";

/**
 * Configuración de los bonus implícitos random que pueden generarse en la arma.
 *
 * Define:
 * - Qué bonus son candidatos a aparecer como implícitos.
 * - Cuántos bonus implícitos puede tener un ítem según su tier.
 * 
 * @property {PossibleBonus[]} possibleBonus - Lista de bonus que pueden ser seleccionados aleatoriamente
      como bonus implícitos del equipamiento.

   @property {AmountByLv[]} quantityByTier -  Cantidad de bonus implícitos que puede recibir un equipamiento
     según su tier.
 */
export interface EquipImplictBonusConfig {
    possibleBonus: PossibleBonus[],
    quantityByTier: AmountByLv[]
}

export interface AmountByLv {
    tier: number, quantity: number
}

/**
 * Define un bonus que puede ser generado como implícito y
 * su configuración de escalado para cada tier.
 */
export interface PossibleBonus {
    bonusRef: BonusRefKeys,
    tierValue: RandomImplicitBonusValueConfig[]
}

/**
 * Configuración de escalado de un bonus implícito para un tier específico.
 *
 * Permite asignar distintos patrones de progresión según
 * el nivel del equipamiento.
 */
export interface RandomImplicitBonusValueConfig {
    tier: number,
    pattern: PatternScaleType
}