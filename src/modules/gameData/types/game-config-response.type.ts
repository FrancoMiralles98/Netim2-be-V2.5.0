import type { GameConfigResponse } from 'netim2-shared';

type SharedZones = GameConfigResponse['zonas'];

/** Admite un rango vacío mientras todavía no se hayan configurado los mobs de la zona. */
export type GameConfigApiResponse = Omit<GameConfigResponse, 'zonas'> & {
    zonas: {
        [Name in keyof SharedZones]: Omit<SharedZones[Name], 'mobsLevls'> & {
            mobsLevls: SharedZones[Name]['mobsLevls'] | [];
        };
    };
};
