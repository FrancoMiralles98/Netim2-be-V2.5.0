import { BadRequestException, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { InventoryItem, NormalPotion, PocionType, ReservePotion } from 'netim2-shared';
import { POCION_LIST } from '../../../item/const/miscs/pocion/pocion-list.const';
import { GENERAL_CHARACTER } from '../../const/general-character.const';
import { UsePotionDto } from '../../dto/use-potion.dto';
import { UseReservePotionDto } from '../../dto/use-reserve-potion.dto';
import { CharacterMapper } from '../../mapper/character-mapper';
import { CharacterPotionService } from './character-potion.service';

describe('CharacterPotionService', () => {
    const service = new CharacterPotionService(new CharacterMapper());
    function character() {
        const source = structuredClone(GENERAL_CHARACTER);
        source.stats.general.hp = { actual: 100, max: 1000 };
        source.stats.general.mana = { actual: 50, max: 500 };
        const potion: NormalPotion = {
            ...structuredClone(POCION_LIST[0]), cantidad: 5, potionType: 'normal',
            effect: [{ resource: 'hp', amount: 300 }, { resource: 'mana', amount: 200 }],
        };
        source.inventario = [
            { ...structuredClone(potion), id: 'other-stack', cantidad: 1, position: { row: 0, col: 0 } },
            { ...potion, id: 'selected', position: { row: 0, col: 1 } },
        ];
        return source;
    }

    it('restores both resources and consumes only the selected stack using the final inventory quantity', () => {
        const source = character();
        const original = structuredClone(source);
        const result = service.usePotion(source, { itemId: 'selected', quantity: 2 });
        expect(result.response).toEqual({ hp: 700, mana: 450, updatedItems: [{ id: 'selected', cantidad: 3 }] });
        expect(result.character.inventario[0]).toEqual(source.inventario[0]);
        expect(result.character.inventario[1]).toMatchObject({ id: 'selected', cantidad: 3 });
        expect(result.character.stats.general.hp).toEqual({ actual: 700, max: 1000 });
        expect(source).toEqual(original);
    });

    it('caps healing, removes an exhausted stack and returns cantidad 0', () => {
        const result = service.usePotion(character(), { itemId: 'selected', quantity: 5 });
        expect(result.response).toEqual({ hp: 1000, mana: 500, updatedItems: [{ id: 'selected', cantidad: 0 }] });
        expect(result.character.inventario.map(item => item.id)).toEqual(['other-stack']);
    });

    it('leaves the unaffected resource unchanged', () => {
        const source = character();
        (source.inventario[1] as NormalPotion).effect = [{ resource: 'hp', amount: 150 }];
        expect(service.usePotion(source, { itemId: 'selected', quantity: 1 }).response).toMatchObject({ hp: 250, mana: 50 });
    });

    it('consumes the exact requested quantity even when resources are already full', () => {
        const source = character();
        source.stats.general.hp.actual = 1000;
        source.stats.general.mana.actual = 500;
        expect(service.usePotion(source, { itemId: 'selected', quantity: 2 }).response).toEqual({
            hp: 1000, mana: 500, updatedItems: [{ id: 'selected', cantidad: 3 }],
        });
    });

    it.each([0, -1, 1.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])('rejects invalid quantity %s without mutation', quantity => {
        const source = character();
        const original = structuredClone(source);
        expect(() => service.usePotion(source, { itemId: 'selected', quantity })).toThrow(BadRequestException);
        expect(source).toEqual(original);
    });

    it('rejects missing items, non-potions and insufficient stock without touching resources or inventory', () => {
        const source = character();
        const original = structuredClone(source);
        expect(() => service.usePotion(source, { itemId: 'missing', quantity: 1 })).toThrow(NotFoundException);
        expect(() => service.usePotion(source, { itemId: 'selected', quantity: 6 })).toThrow('suficientes');
        expect(source).toEqual(original);
        source.inventario[1] = { ...source.inventario[1], type_utility: 'generic' } as unknown as InventoryItem;
        expect(() => service.usePotion(source, { itemId: 'selected', quantity: 1 })).toThrow('no es una poción');
        expect(source.stats).toEqual(original.stats);
    });

    it.each([
        { effects: [{ resource: 'hp', amount: -1 }] },
        { effects: [{ resource: 'mana', amount: Infinity }] },
        { effects: [] },
    ])('rejects unsupported or invalid effects %o before consuming', ({ effects }) => {
        const source = character();
        (source.inventario[1] as NormalPotion).effect = effects as NormalPotion['effect'];
        const original = structuredClone(source);
        expect(() => service.usePotion(source, { itemId: 'selected', quantity: 1 })).toThrow(BadRequestException);
        expect(source).toEqual(original);
    });

    describe('reserve potions', () => {
        function reserveCharacter() {
            const source = character();
            const { effect, ...base } = source.inventario[1] as InventoryItem & NormalPotion;
            source.inventario[1] = { ...base, potionType: 'reserve', cantidad: 1,
                reserve: { max: 2000, actual: 2000 }, resource: ['hp', 'mana'] } as InventoryItem;
            return source;
        }

        it('spends effective HP and mana recovery from the same reserve without requiring effects', () => {
            const source = reserveCharacter();
            source.stats.general.hp.actual = 900;
            const before = structuredClone(source);
            const result = service.useReservePotion(source, { itemId: 'selected' });
            expect(result.response).toEqual({ hp: 1000, mana: 500, updatedItems: [], updatedPotion: {
                id: 'selected', resource: (source.inventario[1] as ReservePotion).resource,
                reserve: { max: 2000, actual: 1450 },
            } });
            expect(source).toEqual(before);
            result.response.updatedPotion!.reserve.actual = 0;
            expect((result.character.inventario[1] as ReservePotion).reserve.actual).toBe(1450);
        });

        it('does not spend reserves when resources are full', () => {
            const source = reserveCharacter();
            source.stats.general.hp.actual = 1000;
            source.stats.general.mana.actual = 500;
            expect(service.useReservePotion(source, { itemId: 'selected' }).character).toEqual(source);
        });

        it('uses the remaining shared reserve in resource order and removes the exhausted item', () => {
            const source = reserveCharacter();
            (source.inventario[1] as ReservePotion).reserve.actual = 350;
            const result = service.useReservePotion(source, { itemId: 'selected' });
            expect(result.response).toEqual({ hp: 450, mana: 50, updatedPotion: null, updatedItems: [{ id: 'selected', cantidad: 0 }] });
            expect(result.character.inventario).toEqual([source.inventario[0]]);
        });

        it('preserves the shared balance between activations', () => {
            const source = reserveCharacter();
            const first = service.useReservePotion(source, { itemId: 'selected' });
            const second = service.useReservePotion(first.character, { itemId: 'selected' });
            expect(second.response).toMatchObject({ hp: 1000, mana: 500, updatedPotion: { reserve: { max: 2000, actual: 650 } } });
        });

        it('skips full HP and spends reserve on mana instead', () => {
            const source = reserveCharacter();
            source.stats.general.hp.actual = 1000;
            (source.inventario[1] as ReservePotion).reserve.actual = 50;
            const result = service.useReservePotion(source, { itemId: 'selected' });
            expect(result.response).toMatchObject({ hp: 1000, mana: 100, updatedPotion: null });
        });

        it('rejects wrong discriminators and invalid reserve bounds without mutation', () => {
            const normal = character();
            (normal.inventario[1] as PocionType).cantidad = 1;
            expect(() => service.useReservePotion(normal, { itemId: 'selected' })).toThrow(BadRequestException);
            expect(() => service.usePotion(reserveCharacter(), { itemId: 'selected', quantity: 1 })).toThrow(BadRequestException);
            for (const reserve of [{ max: 100, actual: 101 }, { max: 100, actual: -1 }, { max: Infinity, actual: 1 }, { max: 100, actual: NaN }]) {
                const source = reserveCharacter();
                (source.inventario[1] as ReservePotion).reserve = reserve;
                const before = structuredClone(source);
                expect(() => service.useReservePotion(source, { itemId: 'selected' })).toThrow(BadRequestException);
                expect(source).toEqual(before);
            }
            const source = reserveCharacter();
            (source.inventario[1] as ReservePotion).cantidad = 2;
            expect(() => service.useReservePotion(source, { itemId: 'selected' })).toThrow('individuales');
        });

        it('validates the reserve DTO', async () => {
            expect(await validate(plainToInstance(UseReservePotionDto, { itemId: 'selected' }))).toEqual([]);
            expect((await validate(plainToInstance(UseReservePotionDto, { itemId: '' }))).length).toBeGreaterThan(0);
        });
    });

    it('validates the provisional request DTO', async () => {
        expect(await validate(plainToInstance(UsePotionDto, { itemId: 'selected', quantity: 2 }))).toEqual([]);
        for (const body of [{ itemId: '', quantity: 1 }, { itemId: 'selected', quantity: 0 }, { itemId: 'selected', quantity: 1.5 }, { itemId: 'selected' }]) {
            expect((await validate(plainToInstance(UsePotionDto, body))).length).toBeGreaterThan(0);
        }
    });
});
