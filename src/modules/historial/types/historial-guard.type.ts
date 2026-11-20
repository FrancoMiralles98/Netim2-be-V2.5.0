import type { HistorialDetalle, PartialHistorialDetalle } from 'netim2-shared';

/** Identifica un detalle completo por su resumen de combatientes. */
export const isHistorialDetalle = (
    historial: PartialHistorialDetalle | HistorialDetalle,
): historial is HistorialDetalle => 'fight' in historial;
