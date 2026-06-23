import { HistorialDetalle, PartialHistorialDetalle } from "./historial-detalle.type";

export const isHistorialDetalle = (
    historial: PartialHistorialDetalle | HistorialDetalle
): historial is HistorialDetalle => {
    return 'fightResult' in historial
}