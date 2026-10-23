import { BadRequestException, INestApplication, NotFoundException, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { GetItemsRequest, IdItemList, UpgradeLv } from 'netim2-shared';
import { IdItem } from 'netim2-shared';
import request = require('supertest');
import { ITEM_LIST } from './const/items.const';
import { ItemModule } from './item.module';
import { ItemService } from './item.service';

describe('Item details', () => {
    let app: INestApplication;
    let service: ItemService;
    beforeAll(async () => {
        const module = await Test.createTestingModule({ imports: [ItemModule] }).compile();
        service = module.get(ItemService);
        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();
    });
    afterAll(async () => { await app?.close(); });

    it('preserves request order, applies upgrade zero and quantity, and recalculates real weapon bonuses', () => {
        const result = service.getItems({ items: [
            { idItem: IdItem.ESPADA, upgradeLv: 3 },
            { idItem: IdItem.POCION_ROJA_P, quantity: 10 },
            { idItem: IdItem.ESPADA, upgradeLv: 0 },
        ] });
        expect(result.map(item => item.idItem)).toEqual([IdItem.ESPADA, IdItem.POCION_ROJA_P, IdItem.ESPADA]);
        expect(result[0]).toMatchObject({ type: 'equip', upgradeLv: 3 });
        expect(result[1]).toMatchObject({ type: 'utility', cantidad: 10 });
        expect(result[2]).toMatchObject({ type: 'equip', upgradeLv: 0 });
        if (result[0].type === 'equip' && result[2].type === 'equip') {
            expect(result[0].implicitBonus.length).toBeGreaterThan(0);
            expect(result[0].implicitBonus).not.toEqual(result[2].implicitBonus);
        }
    });

    it('keeps catalog defaults and returns independent copies without mutating the request or catalog', () => {
        const catalog = structuredClone(ITEM_LIST);
        const input = { items: [{ idItem: IdItem.POCION_ROJA_P }, { idItem: IdItem.POCION_ROJA_P }] };
        const original = structuredClone(input);
        const result = service.getItems(input);
        expect(result[0]).toMatchObject(ITEM_LIST.find(item => item.idItem === IdItem.POCION_ROJA_P)!);
        result[0].name = 'changed';
        expect(result[1].name).not.toBe('changed');
        expect(input).toEqual(original);
        expect(ITEM_LIST).toEqual(catalog);
        expect(service.getItems({ items: [] })).toEqual([]);
    });

    it('supports the upgrade limit of a stone and rejects improvements beyond its own maximum', () => {
        const stone = ITEM_LIST.find(item => item.type === 'utility' && item.type_utility === 'piedra');
        if (!stone || stone.type !== 'utility' || stone.type_utility !== 'piedra') throw new Error('Missing stone fixture');
        expect(service.getItems({ items: [{ idItem: stone.idItem, upgradeLv: stone.upgradeMax as UpgradeLv }] })[0])
            .toMatchObject({ upgradeLv: stone.upgradeMax });
        expect(() => service.getItems({ items: [{ idItem: stone.idItem, upgradeLv: (stone.upgradeMax + 1) as UpgradeLv }] }))
            .toThrow(BadRequestException);
    });

    it('rejects upgrades on non-upgradeable items and quantities on equipment and reserve potions', () => {
        for (const query of [
            { idItem: IdItem.POCION_ROJA_P, upgradeLv: 0 },
            { idItem: IdItem.ESPADA, quantity: 1 },
            { idItem: IdItem.POCION_ROJA_M, quantity: 1 },
        ] as GetItemsRequest['items']) {
            expect(() => service.getItems({ items: [query] })).toThrow(BadRequestException);
        }
    });

    it.each([0, -1, 1.5, Infinity, NaN, 201])('rejects invalid or excessive quantities %s', quantity => {
        expect(() => service.getItems({ items: [{ idItem: IdItem.POCION_ROJA_P, quantity }] })).toThrow(BadRequestException);
    });

    it.each([-1, 1.5, Infinity, NaN, 99])('rejects invalid or excessive upgrades %s', upgradeLv => {
        expect(() => service.getItems({ items: [{ idItem: IdItem.ESPADA, upgradeLv: upgradeLv as UpgradeLv }] })).toThrow(BadRequestException);
    });

    it('rejects malformed requests and missing catalog items', () => {
        expect(() => service.getItems({ items: [{ idItem: -999 as IdItemList }] })).toThrow(NotFoundException);
        for (const invalid of [null, {}, { items: null }, { items: [null] }, { items: [{ idItem: '100' }] }]) {
            expect(() => service.getItems(invalid as unknown as GetItemsRequest)).toThrow(BadRequestException);
        }
    });

    it('exposes the typed response and validates nested query DTOs', async () => {
        const response = await request(app.getHttpServer()).post('/item/details')
            .send({ items: [{ idItem: IdItem.POCION_ROJA_P, quantity: 2, name: 'forged' }] }).expect(200);
        expect(response.body.data).toEqual([expect.objectContaining({ idItem: IdItem.POCION_ROJA_P, cantidad: 2 })]);
        expect(response.body.data[0].name).not.toBe('forged');
        for (const body of [{}, { items: [{ idItem: '100' }] }, { items: [{ idItem: IdItem.ESPADA, upgradeLv: 1.5 }] },
            { items: [{ idItem: IdItem.POCION_ROJA_P, quantity: 0 }] }]) {
            await request(app.getHttpServer()).post('/item/details').send(body).expect(400);
        }
    });
});
