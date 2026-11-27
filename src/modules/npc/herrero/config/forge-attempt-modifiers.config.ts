import type { ForgeAttemptModifierConfig, IdItemList } from 'netim2-shared';
import { IdItem } from 'netim2-shared';

/**
 * Consumibles especiales por idItem. Un ítem ausente no es un modificador de mejora.
 * Los efectos son independientes: puede aumentar la probabilidad, proteger o hacer ambas cosas.
 * successChanceBonus aumenta la chance base porcentualmente: base × (1 + bonus / 100), con máximo de 100 %.
 */
export const FORGE_ATTEMPT_MODIFIERS_CONFIG: Readonly<Partial<Record<IdItemList, ForgeAttemptModifierConfig>>> = {
    [IdItem.MANUAL_DEL_HERRERO]: {
        quantity: 1,
        successChanceBonus: 40,
        preventDestruction: false,
    },
    [IdItem.PERGAMINO_BENDICION]: {
        quantity: 1,
        successChanceBonus: 0,
        preventDestruction: true,
        upgradeLvLossOnProtectedFailure: 1,
    },
    [IdItem.PIEDRA_MAGICA]: {
        quantity: 1,
        successChanceBonus: 20,
        preventDestruction: true,
        upgradeLvLossOnProtectedFailure: 0,
        resourceMultiplier: {
            materials: 2,
            yang: 2
        }
    },
};
