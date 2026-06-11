export type GeneralPatternScale = Record<PatternScaleType, Record<UpgradeLv, number>>

/**
 * Patrones de progresión utilizados para calcular el valor de los
 * bonus implícitos de un equipamiento según su nivel de mejora.
 *
 * Existen dos tipos de patrones:
 *
 * - Ascendentes (`scale_to_X`)
 * - Descendentes (`descending_scale_from_X`)
 *
 * Los patrones ascendentes aumentan progresivamente su valor a medida
 * que el equipamiento mejora, alcanzando aproximadamente el valor
 * indicado en su nombre al llegar a +9.
 *
 * Ejemplos:
 *
 * scale_to_7
 * → progresión que alcanza 7 en +9
 *
 * scale_to_100
 * → progresión que alcanza 100 en +9
 *
 * Los patrones descendentes funcionan de forma inversa:
 * comienzan con un valor negativo indicado en el nombre en +0 y aumentan progresivamente
 * en este caso en la configuracion 

 * Ejemplos:
 *
 * descending_scale_from_50
 * progresion que comienza (+0) en 50 y en +9 (por ejemplo) termina en 10
 *
 * Los niveles +10 y +11 corresponden a mejoras especiales por
 * corrupción y continúan la progresión más allá de los límites
 * normales del equipamiento.
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
    'scale_to_150' |
    'descending_scale_from_5' |
    'descending_scale_from_7' |
    'descending_scale_from_10' |
    'descending_scale_from_12' |
    'descending_scale_from_15' |
    'descending_scale_from_20' |
    'descending_scale_from_25' |
    'descending_scale_from_30' 


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