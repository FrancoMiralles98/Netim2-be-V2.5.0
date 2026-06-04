/**
 * Configuración utilizada para ajustar el peso de aparición
 * de los ítems de equipamiento según la diferencia de nivel
 * entre el mob que genera el drop y el nivel requerido del ítem.
 *
 * Funcionamiento:
 *
 * - Si el ítem tiene el mismo nivel que el mob:
 *
 * Mob lv 40
 * Item lv 40
 * Multiplicador = 1.0
 *
 * - Si el ítem se encuentra varios niveles por debajo:
 *
 * Mob lv 40
 * Item lv 35
 * Multiplicador ≈ 1.25
 *
 * - Si la diferencia alcanza o supera `maxLevelDifference`,
 * se utiliza el multiplicador máximo configurado:
 *
 * Mob lv 40
 * Item lv 30
 * Multiplicador = 1.5
 *
 * - `maxLevelDifference`
 *   Diferencia máxima de niveles utilizada para calcular
 *   el bonus de peso.
 *
 * - `maxMultiplier`
 *   Multiplicador máximo que puede recibir el peso de un ítem
 *   cuando alcanza la diferencia máxima de niveles configurada.
 */
export const EQUIP_DROP_LV_WEIGHT_CONFIG = {
    maxLevelDifference: 10,
    maxMultiplier: 1.5,
}