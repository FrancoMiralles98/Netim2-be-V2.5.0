import { InventoryItem } from 'netim2-shared';
import { POCION_LIST } from '../const/miscs/pocion/pocion-list.const';
import { createPocionItem } from '../factories/item-builder';
import { ItemHydrationService } from './item-hydration.service';

describe('Potion contract and hydration', () => {
    const hydration = new ItemHydrationService();

    it.each([0, 600, 1000])('preserves a saved shared reserve of %i instead of replenishing it', actual => {
        const base = createPocionItem({ ...POCION_LIST[1], potionType: 'reserve', resource: ['hp'], reserve: { max: 1000, actual: 1000 } });
        expect(base.potionType).toBe('reserve');
        const saved = { ...base, id: 'instance', position: { row: 0, col: 1 }, cantidad: 1,
            reserve: { max: 1000, actual } } as InventoryItem;
        const before = structuredClone(saved);
        const result = hydration.hydrateInventoryItem(base, saved);
        expect(result).toMatchObject({ potionType: 'reserve', reserve: { max: 1000, actual }, id: 'instance', cantidad: 1 });
        expect(result).toHaveProperty('resource', ['hp']);
        expect(result).not.toHaveProperty('effect');
        expect(saved).toEqual(before);
    });

    it('hydrates normal potions with the discriminator without adding a reserve', () => {
        const base = POCION_LIST[0];
        const saved = { ...base, id: 'instance', cantidad: 3, position: { row: 0, col: 0 } };
        const result = hydration.hydrateInventoryItem(base, saved);
        expect(result).toMatchObject({ potionType: 'normal', cantidad: 3 });
        expect(result).not.toHaveProperty('reserve');
    });
});
