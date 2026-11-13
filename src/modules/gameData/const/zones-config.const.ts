import type { GameConfigApiResponse } from '../types/game-config-response.type';

export const ZONES_CONFIG: GameConfigApiResponse['zonas'] = {
    city1: { name: 'city1', lvToUnlock: 1, cost: 0, mobsLevls: [1,2], idItems: [] },
    city2: { name: 'city2', lvToUnlock: 10, cost: 5_000, mobsLevls: [2,4], idItems: [] },
    valle: { name: 'valle', lvToUnlock: 20, cost: 10_000, mobsLevls: [4,6], idItems: [] },
    desierto: { name: 'desierto', lvToUnlock: 30, cost: 20_000, mobsLevls: [10,12], idItems: [] },
    montaña: { name: 'montaña', lvToUnlock: 40, cost: 30_000, mobsLevls: [22,30], idItems: [] },
    templo: { name: 'templo', lvToUnlock: 50, cost: 50_000, mobsLevls: [33,40], idItems: [] },
};
