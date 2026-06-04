
/**
 * Configuración global de los bonus misc relacionados con
 * la obtención de recompensas tras derrotar enemigos.
 *
 *
 * Propiedades:
 *
 * - `chances_objetos`
 *   Incremento porcentual aplicado a las probabilidades de obtener
 *   categorías de drops consideradas raras.
 
 *
 * - `chances_exp`
 *   Multiplicador adicional de experiencia obtenido cuando se activa
 *   el bonus de experiencia.
 *
 *   Ejemplo:
 *   0.30 = +30% EXP
 *
 * - `chances_yang`
 *   Multiplicador adicional de yang obtenido cuando se activa
 *   el bonus de yang.
 *
 *   El valor se encuentra expresado en formato decimal.
 */
export const MISCS_BONUS_CONFIG = {
    'chances_objetos': 20, 
    'chances_exp': 0.30, 
    'chances_yang': 1, 
}