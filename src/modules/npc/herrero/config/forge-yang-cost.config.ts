import type { ForgeTargetUpgradeLv } from 'netim2-shared';

/** Coste provisional: (base + lvReq × coste por nivel) × factor del destino. */
export const FORGE_YANG_COST_CONFIG = {
    base: 100,
    perRequiredLevel: 20,
    upgradeMultipliers: {
        1: 1, 2: 2, 3: 3, 4: 5, 5: 8, 6: 12, 7: 18, 8: 26, 9: 36,
    } satisfies Record<ForgeTargetUpgradeLv, number>,
} as const;
