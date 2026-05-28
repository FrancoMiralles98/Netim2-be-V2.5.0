import { FighterType } from "./fight-entity.type";

/**
 * Resultado final de un combate.
 *
 * @property {string} initialAttacker - Nombre o identificador del luchador que inició el combate.
 *
 * @property {string} [winner] - Nombre o identificador del ganador del combate.
 * Puede ser undefined en caso de empate
 *
 * @property {number} totalTurns - Cantidad total de turnos ejecutados durante el combate.
 *
 * @property {FighterType[]} fighters - Lista principal de luchadores involucrados en el combate.
 *
 * @property {FighterType[]} party - Integrantes aliados relacionados al combate.
 *
 * @property {FighterType[]} spawns - Entidades invocadas durante el combate.
 */
export interface FightResult {
    initialAttacker: string,
    winner?: string,
    totalTurns: number;
    fighters: FighterType[],
    party: FighterType[],
    spawns: FighterType[]
}