/**
 * Niveles de rareza utilizados por el sistema de drops para
 * determinar la frecuencia relativa de aparición de un ítem
 * dentro de un pool de selección ponderada.
 *
 * Estas rarezasrepresentan la probabilidad
 * de que dicho objeto sea seleccionado cuando forma parte
 * de un pool de drops.
 *
 * Cada nivel se encuentra asociado a un weight definido en
 * `DROP_WEIGHT`, donde los valores más altos aparecen con
 * mayor frecuencia y los más bajos son más difíciles de obtener.
 *
 */

export type DropWeightType = 
'VERY_COMMON' |
'COMMON' |
'UNCOMMON'|
'RARE' |
'VERY_RARE' |
'ULTRA_RARE'