/**
 * Datos de PvP (Arena) asociados al personaje.
 *
 * @description
 * Contiene estadísticas, estado actual y restricciones relacionadas al Arena.
 *
 * @property {number} lp
 * Puntos de liga del personaje.
 *
 * @property {number} totalWins
 * Cantidad total de victorias en PvP.
 *
 * @property {number} totalLosses
 * Cantidad total de derrotas en PvP.
 *
 * @property {number} equip_selected
 * Identificador del set de equipo actualmente usado en PvP.
 *
 * @property {number} lastEquipUpdated
 * Timestamp del último cambio de equipo en PvP.
 *
 * @property {string[]} battledCharacterIds
 * Lista de ids de personajes contra los que ya se ha combatido. (se renueva una vez al dia)
 *
 * @property {number} remainingLosses
 * Cantidad de derrotas restantes antes de aplicar restricción de perdida de lp
 
 * @property {number} claimYang
 * Cantidad de recompensa de yang por el rango en el que esta, disponible para reclamar
 * (Se puede reclamar una vez por dia).
 */
export interface PvpDataType {
    lp: number;
    totalWins: number;
    totalLosses: number;
    equip_selected:number;
    lastEquipUpdated: number;
    battledCharacters: string[];
    remainingLosses: number;
    claimYang: number;
}