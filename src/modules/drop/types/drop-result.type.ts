import { ItemDTO } from "netim2-shared";

/**
 * Representa el resultado final de una recompensa obtenida
 * tras derrotar a un enemigo.
 *
 * Contiene todos los recursos generados por el sistema de drops:
 *
 * - `yang`
 *   Cantidad total de yang obtenida.
 *
 * - `exp`
 *   Cantidad total de experiencia obtenida.
 *
 * - `items`
 *   Lista de ítems generados durante los intentos de drop
 */
export interface DropResult {
    yang: number;
    exp: number;
    items: ItemDTO[]
}