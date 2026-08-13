import { DropTag } from "netim2-shared";

/**
 * Lista de categorías de drop consideradas "raras" por el sistema.
 *
 * Cuando un jugador posee bonus de frecuencia de objetos raros,
 * únicamente estas categorías reciben un incremento en sus pesos
 * de selección durante la generación del drop.
 *
 * Este sistema permite aumentar la aparición de recompensas valiosas
 * sin afectar los drops comunes o de progreso básico.
 *
 * Utilizado por:
 * - Bonus de frecuencia de objetos raros.
 * - Modificadores de drop especiales.
 * - Eventos que aumentan la calidad de las recompensas.
 */
export const RARE_DROP_TAGS: DropTag[] = [
    'special_utility',
    'special_drop',
    'corrupt_drop',
    'mob_specific'
]