export type GeneralPatternScale = Record<PatternScaleType, Record<UpgradeLv, number>>

/**
 * Patrones de progresión utilizados para calcular el valor de los
 * bonus implícitos de un equipamiento según su nivel de mejora.
 *
 * Cada patrón define una curva de crecimiento que parte de un valor
 * base y progresa hasta alcanzar aproximadamente el valor indicado
 * en su nombre al llegar a +9.
 *
 * scale_to_7
 * → progresión que alcanza 7 en +9
 *
 * scale_to_100
 * → progresión que alcanza 100 en +9
 *
 */
export type PatternScaleType =
    'scale_to_7' |
    'scale_to_10' |
    'scale_to_12' |
    'scale_to_15' |
    'scale_to_20' |
    'scale_to_25' |
    'scale_to_30' |
    'scale_to_35' |
    'scale_to_40' |
    'scale_to_45' |
    'scale_to_50' |
    'scale_to_55' |
    'scale_to_70' |
    'scale_to_80' |
    'scale_to_100' |
    'scale_to_125' |
    'scale_to_150'


/**
 * Nivel de mejora de un equipamiento.
 *
 * Representa el estado actual de mejora del objeto.
 *
 * Niveles normales: +0 a +9
 *
 * Estos corresponden a las mejoras estándar que cualquier
 * equipamiento puede obtener mediante el sistema normal
 * de progresión.
 *
 * Niveles de corrupción:  +10, +11
 *
 * Son niveles especiales obtenidos mediante sistemas de
 * corrupción o mejoras avanzadas y permiten superar los
 * límites tradicionales del equipamiento.
 */
export type UpgradeLv =
    0 |
    1 |
    2 |
    3 |
    4 |
    5 |
    6 |
    7 |
    8 |
    9 |
    10 |
    11