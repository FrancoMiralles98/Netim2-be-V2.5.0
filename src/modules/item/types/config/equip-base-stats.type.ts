import { BonusRefKeys } from "src/modules/bonus/types/bonusListHelper/ref-bonus-name.type"

/**
 * Configuración genérica utilizada para calcular la progresión
 * de una estadística mediante una curva de escalado.
 *
 * Puede utilizarse para:
 *
 * - Escalado por nivel requerido del equipamiento.
 * - Escalado por nivel de mejora (+0 a +9).
 *
 * Fórmula:
 * 
 * valor = base + (incremento * nivel^power)
 *
 * - `base`
 *   Valor inicial de la estadística.
 *
 * - `perLv`
 *   Incremento aplicado por cada nivel.
 *
 *   Dependiendo del contexto:
 *
 *   - En escalado de equipamiento representa el incremento
 *     por nivel requerido del item.
 *
 *   - En escalado de mejoras representa el incremento
 *     por cada nivel de mejora (+1, +2, +3, etc.).
 *
 * - `power`
 *   Exponente utilizado para controlar la forma de la curva
 *   de crecimiento.
 *
 *   Valores habituales:
 *
 *   1.0  -> crecimiento lineal
 *   1.05 -> crecimiento progresivo suave
 *   1.15 -> crecimiento progresivo medio
 *   1.30 -> crecimiento progresivo agresivo
 *
 * Ejemplo para escalado por nivel:
 *
 *   base: 7,
 *   perLv: 2,
 *   power: 1.05
 *
 * lvReq 1  -> 9
 * lvReq 10 -> 29
 * lvReq 50 -> 128
 *
 * Ejemplo para escalado por mejora:
 *
 *   base: 0,
 *   perLv: 4,
 *   power: 1.18
 *
 * +0 -> 0
 * +1 -> 4
 * +5 -> 27
 * +9 -> 53
 */
export interface StatScalingConfig {
    base: number
    perLv: number
    power: number
}



/**
 * Configuración de escalado para una estadística que posee
 * un rango mínimo y máximo.
 *
 * Es utilizada principalmente en armas y equipamientos que
 * manejan valores variables:
 *
 * - Daño físico (AD)
 * - Daño mágico (AP)
 *
 * Cada extremo del rango utiliza su propia configuración
 * de escalado independiente.
 */
export interface DamageScalingConfig {
    min: StatScalingConfig
    max: StatScalingConfig
}


export type WeaponDamageScalingConfig = Partial<Record<'ad' | 'ap', DamageScalingConfig>>

export type ArmorDamageScalingConfig = Record<Extract<BonusRefKeys,'def'>, StatScalingConfig>
