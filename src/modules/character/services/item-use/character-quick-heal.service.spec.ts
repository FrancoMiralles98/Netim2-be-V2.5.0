import { BadRequestException } from '@nestjs/common';
import { InventoryItem, NormalPotion, PotionEffect, ReservePotion } from 'netim2-shared';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { POCION_LIST } from '../../../item/const/miscs/pocion/pocion-list.const';
import { GENERAL_CHARACTER } from '../../const/general-character.const';
import { CharacterMapper } from '../../mapper/character-mapper';
import { QuickHealDto } from '../../dto/quick-heal.dto';
import type { QuickHealResource } from 'netim2-shared';
import { CharacterPotionService } from './character-potion.service';

describe('CharacterPotionService quickHeal', () => {
    const service = new CharacterPotionService(new CharacterMapper());
    function potion(id: string, cantidad: number, effect: PotionEffect[]): InventoryItem {
        return { ...structuredClone(POCION_LIST[0]), potionType: 'normal', id, cantidad, effect, position: { row: 0, col: 0 } };
    }
    function reservePotion(id: string, actual: number, resource: ReservePotion['resource']): InventoryItem {
        const { effect, ...base } = potion(id, 1, []) as InventoryItem & NormalPotion;
        return { ...base, potionType: 'reserve', resource, reserve: { max: actual, actual } };
    }
    function character(items: InventoryItem[]) {
        const source = structuredClone(GENERAL_CHARACTER);
        source.stats.general.hp = { actual: 100, max: 1000 };
        source.stats.general.mana = { actual: 50, max: 500 };
        source.inventario = items;
        return source;
    }

    it('uses weaker potions first and consumes only the necessary units of the larger stack', () => {
        const source = character([
            potion('large', 5, [{ resource: 'hp', amount: 500 }]),
            potion('small', 3, [{ resource: 'hp', amount: 100 }]),
            potion('mana', 10, [{ resource: 'mana', amount: 100 }]),
        ]);
        const original = structuredClone(source);
        const result = service.quickHeal(source, ['hp']);
        expect(result.response).toEqual({ hp: 1000, mana: 50, updatedPotions: [], updatedItems: [
            { id: 'small', cantidad: 0 }, { id: 'large', cantidad: 3 },
        ] });
        expect(source).toEqual(original);
        expect(result.character.inventario.find(item => item.id === 'mana')).toEqual(source.inventario[2]);
    });

    it('returns partial recovery when available potions are exhausted', () => {
        const result = service.quickHeal(character([potion('small', 2, [{ resource: 'hp', amount: 100 }])]), ['hp', 'mana']);
        expect(result.response).toEqual({ hp: 300, mana: 50, updatedItems: [{ id: 'small', cantidad: 0 }], updatedPotions: [] });
        expect(result.character.inventario).toEqual([]);
    });

    it('heals both resources and merges the final quantity when the same mixed stack is used twice', () => {
        const result = service.quickHeal(character([potion('mixed', 10, [
            { resource: 'hp', amount: 300 }, { resource: 'mana', amount: 100 },
        ])]), ['hp', 'mana']);
        expect(result.response).toEqual({ hp: 1000, mana: 500, updatedPotions: [], updatedItems: [{ id: 'mixed', cantidad: 5 }] });
        expect(result.character.inventario[0]).toMatchObject({ id: 'mixed', cantidad: 5 });
    });

    it('uses a shared reserve without effects and returns the final balance', () => {
        const item = reservePotion('reserve', 3000, ['hp', 'mana']);
        const source = character([item]);
        const result = service.quickHeal(source, ['hp', 'mana']);
        expect(result.response).toEqual({ hp: 1000, mana: 500, updatedItems: [], updatedPotions: [{
            id: 'reserve', resource: (item as ReservePotion).resource, reserve: { max: 3000, actual: 1650 },
        }] });
        expect((source.inventario[0] as ReservePotion).reserve.actual).toBe(3000);
    });

    it('prioritizes the requested resource in mixed reserves without changing their resource order', () => {
        const source = character([reservePotion('reserve', 1000, ['hp', 'mana'])]);
        const result = service.quickHeal(source, ['mana']);
        expect(result.response).toEqual({ hp: 650, mana: 500,
            updatedPotions: [], updatedItems: [{ id: 'reserve', cantidad: 0 }] });
        expect((source.inventario[0] as ReservePotion).resource).toEqual(['hp', 'mana']);
    });

    it('removes depleted shared reserves and continues with normal potions', () => {
        const reserve = reservePotion('reserve', 200, ['hp']);
        const result = service.quickHeal(character([
            potion('ordinary', 2, [{ resource: 'hp', amount: 500 }]), reserve,
        ]), ['hp']);
        expect(result.response).toEqual({ hp: 1000, mana: 50, updatedPotions: [], updatedItems: [
            { id: 'reserve', cantidad: 0 }, { id: 'ordinary', cantidad: 0 },
        ] });
    });

    it('does nothing when requested resources are full or no matching potions exist', () => {
        const source = character([potion('mana', 5, [{ resource: 'mana', amount: 100 }])]);
        expect(service.quickHeal(source, ['hp']).character).toEqual(source);
        source.stats.general.mana.actual = 500;
        const result = service.quickHeal(source, ['mana']);
        expect(result.character).toEqual(source);
        expect(result.response.updatedItems).toEqual([]);
    });

    it.each([{ resources: [] }, { resources: ['hp', 'hp'] }, { resources: ['invalid'] }])('rejects invalid resources %o', ({ resources }) => {
        const source = character([]);
        expect(() => service.quickHeal(source, resources as QuickHealResource[])).toThrow(BadRequestException);
    });

    it('validates the provisional DTO', async () => {
        expect(await validate(plainToInstance(QuickHealDto, { resources: ['hp', 'mana'] }))).toEqual([]);
        for (const resources of [[], ['hp', 'hp'], ['other'], 'hp']) {
            expect((await validate(plainToInstance(QuickHealDto, { resources }))).length).toBeGreaterThan(0);
        }
    });
});
