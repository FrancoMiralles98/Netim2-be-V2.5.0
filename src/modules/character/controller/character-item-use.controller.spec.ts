import { INestApplication, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request = require('supertest');
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { CharacterItemUseOrchestratorService } from '../services/item-use/character-item-use-orchestrator.service';
import { CharacterItemUseController } from './character-item-use.controller';

describe('CharacterItemUseController HTTP', () => {
    let app: INestApplication;
    const response = { hp: 700, mana: 200, updatedItems: [] };
    const service = { usePotion: jest.fn(), useReservePotion: jest.fn(), quickHeal: jest.fn(), applyBuff: jest.fn(), refreshBuffs: jest.fn(), openChest: jest.fn(), openChestBulk: jest.fn() };
    let authenticated: boolean;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            controllers: [CharacterItemUseController],
            providers: [{ provide: CharacterItemUseOrchestratorService, useValue: service }],
        }).overrideGuard(AccessTokenGuard).useValue({
            canActivate(context) {
                if (!authenticated) throw new UnauthorizedException();
                context.switchToHttp().getRequest().user = { accountId: 'authenticated-owner' };
                return true;
            },
        }).compile();
        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();
    });
    beforeEach(() => {
        authenticated = true;
        for (const mock of Object.values(service)) mock.mockReset().mockResolvedValue(response);
    });
    afterAll(async () => { await app?.close(); });

    it.each([
        ['chests/bulk', 'openChestBulk', { itemId: 'chest-instance', quantity: 3 }],
        ['chests', 'openChest', { itemId: 'chest-instance', selectedItemIds: [1, 2] }],
        ['buffs', 'applyBuff', { itemId: 'buff-instance' }],
        ['potions', 'usePotion', { itemId: 'instance', quantity: 2 }],
        ['potions/reserve', 'useReservePotion', { itemId: 'instance' }],
        ['potions/quick-heal', 'quickHeal', { resources: ['hp', 'mana'] }],
    ] as const)('delegates %s with validated data and the authenticated account', async (route, method, body) => {
        const result = await request(app.getHttpServer()).post(`/character/character-id/item-use/${route}`)
            .send({ ...body, accountId: 'forged-account' }).expect(200);
        expect(result.body).toEqual({ data: response });
        expect(service[method]).toHaveBeenCalledWith('character-id', 'authenticated-owner', body);
    });

    it.each([
        ['chests/bulk', { itemId: 'chest', quantity: 0 }],
        ['chests/bulk', { itemId: 'chest', quantity: -1 }],
        ['chests/bulk', { itemId: 'chest', quantity: 1.5 }],
        ['chests/bulk', { itemId: 'chest' }],
        ['chests/bulk', { itemId: '   ', quantity: 1 }],
        ['chests', { itemId: '' }],
        ['chests', { itemId: 'chest', selectedItemIds: [1, 1] }],
        ['chests', { itemId: 'chest', selectedItemIds: ['invalid'] }],
        ['buffs', { itemId: '' }],
        ['buffs', { itemId: '   ' }],
        ['buffs', {}],
        ['buffs', { itemId: 123 }],
        ['potions', { itemId: 'instance', quantity: 0 }],
        ['potions/reserve', { itemId: '' }],
        ['potions/quick-heal', { resources: ['invalid'] }],
    ])('rejects invalid bodies for %s before calling the service', async (route, body) => {
        await request(app.getHttpServer()).post(`/character/id/item-use/${route}`).send(body).expect(400);
        for (const mock of Object.values(service)) expect(mock).not.toHaveBeenCalled();
    });

    it('requires authentication', async () => {
        authenticated = false;
        await request(app.getHttpServer()).post('/character/id/item-use/potions').send({ itemId: 'instance', quantity: 1 }).expect(401);
        expect(service.usePotion).not.toHaveBeenCalled();
    });

    it('refreshes expired buffs using only the authenticated account and character ID', async () => {
        const snapshot = { stats: {}, attributes: {}, buffos: [] };
        service.refreshBuffs.mockResolvedValue(snapshot);
        await request(app.getHttpServer()).post('/character/id/item-use/buffs/refresh')
            .send({ accountId: 'forged-owner' }).expect(200, { data: snapshot });
        expect(service.refreshBuffs).toHaveBeenCalledWith('id', 'authenticated-owner');
    });

    it.each(['buffs', 'buffs/refresh', 'chests', 'chests/bulk'])('requires authentication for %s', async route => {
        authenticated = false;
        await request(app.getHttpServer()).post('/character/id/item-use/' + route).send({ itemId: 'instance' }).expect(401);
        expect(service.applyBuff).not.toHaveBeenCalled();
        expect(service.refreshBuffs).not.toHaveBeenCalled();
    });
});
