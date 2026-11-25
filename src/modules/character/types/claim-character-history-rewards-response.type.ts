import type { AddItemResult, ClaimHistoryRewardsResponse } from 'netim2-shared';

/** Estado del historial y cambios de inventario confirmados por el reclamo. */
export type ClaimCharacterHistoryRewardsResponse = ClaimHistoryRewardsResponse & AddItemResult;
