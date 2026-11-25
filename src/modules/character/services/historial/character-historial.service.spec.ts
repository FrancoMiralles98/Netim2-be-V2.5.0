import { BadRequestException } from '@nestjs/common';
import type { InventoryItem, ItemDTO, PreparedHistoryRewards } from 'netim2-shared';
import { GENERAL_CHARACTER } from '../../const/general-character.const';
import { POCION_LIST } from '../../../item/const/miscs/pocion/pocion-list.const';
import { CharacterHistorialService } from './character-historial.service';

describe('CharacterHistorialService', () => {
    const service = new CharacterHistorialService();
    const potion = (cantidad: number) => ({ ...structuredClone(POCION_LIST[0]), cantidad });
    const prepared = (...items: ItemDTO[]): PreparedHistoryRewards => ({
        historialId: 'history', rewards: items.map((item, index) => ({ rewardId: String(index), item })),
    });

    it('consolida varias recompensas en un stack existente y devuelve las cantidades finales', () => {
        const character = structuredClone(GENERAL_CHARACTER);
        character.inventario = [{ ...potion(195), id: 'original', position: { row: 0, col: 0 } }];
        const result = service.claimRewards(character, prepared(potion(3), potion(4)));
        expect(result.changes.updatedItems).toEqual([{ id: 'original', cantidad: 200 }]);
        expect(result.changes.newItems).toHaveLength(1);
        expect(result.changes.newItems[0]).toMatchObject({ cantidad: 2, position: expect.anything() });
        expect(character.inventario[0]).toMatchObject({ cantidad: 195 });
    });

    it('devuelve una sola instancia nueva con el stock final si varias recompensas se apilan entre sí', () => {
        const character = structuredClone(GENERAL_CHARACTER);
        character.inventario = [];
        const result = service.claimRewards(character, prepared(potion(20), potion(30)));
        expect(result.changes.newItems).toHaveLength(1);
        expect(result.changes.newItems[0]).toMatchObject({ cantidad: 50 });
        expect(result.changes.updatedItems).toEqual([]);
    });

    it('rechaza el lote si solo entra el primer ítem y conserva intactos personaje y recompensas', () => {
        const character = structuredClone(GENERAL_CHARACTER);
        const item = { ...potion(1), acc: false, size: { rows: 1, cols: 1 } };
        character.inventario = Array.from({ length: 113 }, (_, index): InventoryItem => ({
            ...item, id: String(index), position: { row: Math.floor(index / 19), col: index % 19 },
        }));
        const rewards = prepared(item, item);
        const before = structuredClone({ character, rewards });
        expect(() => service.claimRewards(character, rewards)).toThrow(BadRequestException);
        expect({ character, rewards }).toEqual(before);
    });
});
