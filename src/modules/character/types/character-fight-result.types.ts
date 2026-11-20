import type { CharacterPersistence, CharacterFightResultResponse, CreateHistorialInput } from 'netim2-shared';

/** Liquidación en memoria que el orquestador guarda junto con el historial. */
export type CharacterFightResult = {
    character: CharacterPersistence;
    response: Omit<CharacterFightResultResponse, 'historialId'>;
    historial: CreateHistorialInput;
};
