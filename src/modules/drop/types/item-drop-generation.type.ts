import { ItemBonusQuality } from "netim2-shared";

/**
 * Configuración utilizada para generar las propiedades aleatorias
 * de un equipamiento obtenido mediante el sistema de drops.
 *
 * Define:
 * - La calidad del ítem generado.
 * - La cantidad de bonus explícitos que recibirá.
 *
 * Esta configuración se encuentra asociada a una combinación de:
 * - Tipo de enemigo (`mob`, `netim`, `boss`, `raid`).
 * - Dificultad del enemigo.
 *
 * Es utilizada después de seleccionar el equipamiento base y antes
 * de construir la versión final del objeto.
 */
export interface ItemDropGenerationConfig {
    qualityChance: Record<ItemBonusQuality, number>;
    quantityBonusChance: Record<0 | 1 | 2 | 3 | 4 | 5, number>;
}