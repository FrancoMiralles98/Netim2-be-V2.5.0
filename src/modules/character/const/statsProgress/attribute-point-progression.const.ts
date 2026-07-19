/**
 * Define los umbrales de progreso de experiencia (en porcentaje)
 * dentro de un nivel para otorgar puntos de atributo al personaje.
 *
 * Funcionamiento:
 * - A medida que el personaje gana EXP dentro de un nivel, se evalúa
 *   el porcentaje alcanzado respecto a `exp_next_lv`.
 * - Al superar cada uno de estos valores (25%, 50%, 75%), el personaje
 *   obtiene puntos de atributo que lo puede gastar en STR, DEX, INT o VIT.
 *
 * Restricciones importantes:
 * - Cada umbral solo puede otorgar puntos **una vez por nivel**.
 * - Si el personaje pierde EXP (por ejemplo, baja de 90% a 40%) y vuelve
 *   a superar los umbrales, **NO vuelve a recibir puntos**.
 * - Los puntos de atributo vuelven a poder ganarse únicamente al subir
 *   de nivel y comenzar un nuevo ciclo de progreso.
 */
export const ATTRIBUTE_POINT_PROGRESSION = {
    FIRST: 25,
    SECOND: 50,
    THIRD: 75,
} as const;