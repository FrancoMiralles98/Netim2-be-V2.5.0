import { UpgradeLv } from "../../types/config/general-implicit.type";

/**
 * Multiplicadores aplicados a las estadísticas base de un equipamiento según su nivel de mejora.
 *
 * Cada valor representa cuánto se multiplica la estadística al valor base del ítem. 
 *
 * Fórmula:
 * `valorFinal = valorBase * UPGRADE_MULTIPLIER[upgradeLv]`
 *
 */
export const UPGRADE_MULTIPLIER: Record<UpgradeLv, number> = {
    0: 1,
    1: 1.08,
    2: 1.17,
    3: 1.27,
    4: 1.38,
    5: 1.50,
    6: 1.63,
    7: 1.77,
    8: 1.92,
    9: 2.10,
    10: 2.30,
    11: 2.53,
}