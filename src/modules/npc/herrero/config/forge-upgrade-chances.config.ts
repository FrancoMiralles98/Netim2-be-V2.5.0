import type { ForgeUpgradeLv } from 'netim2-shared';

/**
 * Probabilidades provisionales según el nivel de destino: la clave 4 corresponde a +3 → +4.
 * +0 representa el estado inicial y no una mejora ejecutable.
 */
export const FORGE_UPGRADE_CHANCES_CONFIG: Readonly<Record<ForgeUpgradeLv, number>> = {
    0: 100,
    1: 100,
    2: 90,
    3: 80,
    4: 70,
    5: 60,
    6: 50,
    7: 40,
    8: 30,
    9: 20,
};
