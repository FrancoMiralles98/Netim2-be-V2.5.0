import { BadRequestException, Injectable } from '@nestjs/common';
import type { AddItemResult, CharacterPersistence, InventoryChangeResult, PreparedHistoryRewards } from 'netim2-shared';
import { Inventory } from '../../../inventory/entities/inventory.entity';

/** Aplica las recompensas del historial sobre una copia del inventario. */
@Injectable()
export class CharacterHistorialService {
    /** Inserta el lote completo; si un ítem no entra, descarta todos los cambios de la copia. */
    claimRewards(character: CharacterPersistence, prepared: PreparedHistoryRewards): {
        inventario: CharacterPersistence['inventario']; changes: AddItemResult;
    } {
        const inventory = new Inventory(structuredClone(character.inventario));
        try {
            for (const reward of prepared.rewards) {
                inventory.addItem(structuredClone(reward.item));
            }
        } catch (error) {
            throw new BadRequestException(error instanceof Error ? error.message : 'No se pueden agregar las recompensas');
        }

        const inventario = inventory.getInventory();
        const original = new Map(character.inventario.map(item => [item.id, item]));
        const updatedItems: InventoryChangeResult[] = [];
        for (const item of inventario) {
            const previous = original.get(item.id);
            if (previous?.type === 'utility' && item.type === 'utility' && previous.cantidad !== item.cantidad) {
                updatedItems.push({ id: item.id, cantidad: item.cantidad });
            }
        }
        return {
            inventario,
            changes: { newItems: inventario.filter(item => !original.has(item.id)), updatedItems },
        };
    }
}
