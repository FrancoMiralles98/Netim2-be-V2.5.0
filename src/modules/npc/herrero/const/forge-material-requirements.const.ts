import { IdItem } from 'netim2-shared';
import type { ForgeMaterialRequirementGroup } from 'netim2-shared';

/**
 * Agrupa los ítems que comparten materiales por mejora de destino.
 * Cada idItem debe aparecer en un único grupo. Un ítem o nivel ausente no exige materiales.
 *
 * Ejemplo de estructura:
 * {
 *   idItems: [IdItem.ESPADA, IdItem.ESPADA_LARGA],
 *   requirementsByUpgrade: {
 *     1: [],
 *     2: [{ idItem: IdItem.GARRA_DE_LOBO, quantity: 2 }],
 *     3: [{ idItem: IdItem.GARRA_DE_LOBO, quantity: 5 }],
 *   },
 * }
 */
export const FORGE_MATERIAL_REQUIREMENTS: readonly ForgeMaterialRequirementGroup[] = [
    {
        idItems: [IdItem.ESPADA],
        requirementsByUpgrade: {
            "1": [{idItem:IdItem.GARRA_DE_LOBO,quantity:1},{idItem:IdItem.NARIZ_DE_CERDO,quantity:1},{idItem:IdItem.PIEL_DE_PIE_DE_OSO,quantity:3}]
        }
    }
];
