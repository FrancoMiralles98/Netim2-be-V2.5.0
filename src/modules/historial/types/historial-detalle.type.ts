
/**
 * Información detallada de una batalla registrada en el historial.
 *
 * Este objeto almacena los datos necesarios para visualizar y consultar
 * combates realizados por un personaje, incluyendo el tipo de enfrentamiento,
 * resultado, oponente y fecha de ejecución.
 */
export interface HistorialDetalle {
    filtro: 'pvm' | 'pvp'
    numeroDeBatalla: number;
    enemigo: string;
    fecha: number;
    remainingReward: boolean;
    fightResult: any
}

/**
 * Información resumida de una batalla almacenada en el historial.
 *
 * Esta versión excluye el objeto `fightResult`, que contiene el detalle
 * completo del combate y suele ser considerablemente más pesado.
 *
 * Se utiliza para construir listados e índices de historial donde solo
 * es necesario mostrar información básica como el enemigo, la fecha,
 * el tipo de combate y el resultado general, evitando cargar los datos
 * completos de la simulación.
 */
export type PartialHistorialDetalle = Omit<HistorialDetalle, 'fightResult'>
