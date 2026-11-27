import type { CharacterPersistence } from 'netim2-shared';

/** Cambios de una operación en memoria que el orquestador debe persistir juntos. */
export interface ShopActionResult<T> {
    changes: Pick<CharacterPersistence, 'inventario' | 'yang'>;
    response: T;
}
