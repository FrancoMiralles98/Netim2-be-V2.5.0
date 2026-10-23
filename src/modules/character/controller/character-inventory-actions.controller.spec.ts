import { INestApplication, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request = require('supertest');
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { CharacterInventoryOrchestratorService } from '../services/inventory/character-inventory-orchestrator.service';
import { CharacterInventoryController } from './character-inventory.controller';

describe('Character inventory action routes', () => {
    let app: INestApplication;
    let authorized: boolean;
    const service = { splitItem: jest.fn(), discardItem: jest.fn(), mergeItems: jest.fn() };

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            controllers: [CharacterInventoryController],
            providers: [{ provide: CharacterInventoryOrchestratorService, useValue: service }],
        }).overrideGuard(AccessTokenGuard).useValue({ canActivate(context) {
            if (!authorized) throw new UnauthorizedException();
            context.switchToHttp().getRequest().user = { accountId: 'owner' };
            return true;
        } }).compile();
        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();
    });
    beforeEach(() => {
        authorized = true;
        service.splitItem.mockReset().mockResolvedValue({ newItems: [], updatedItems: [{ id: 'stack', cantidad: 15 }] });
        service.discardItem.mockReset().mockResolvedValue({ id: 'stack' });
        service.mergeItems.mockReset().mockResolvedValue({ updatedItems: [{ id: 'source', cantidad: 0 }, { id: 'target', cantidad: 30 }] });
    });
    afterAll(async () => { await app?.close(); });

    it('validates the split request and delegates using the authenticated owner', async () => {
        await request(app.getHttpServer()).post('/character/character-id/inventory/split')
            .send({ itemId: 'stack', quantity: 10, accountId: 'forged' }).expect(200);
        expect(service.splitItem).toHaveBeenCalledWith('character-id', 'owner', { itemId: 'stack', quantity: 10 });
    });

    it('validates and delegates merging with the authenticated owner', async () => {
        const body = { itemId: 'source', targetItemId: 'target', quantity: 10 };
        const response = await request(app.getHttpServer()).post('/character/character-id/inventory/merge').send({ ...body, accountId: 'forged' }).expect(200);
        expect(service.mergeItems).toHaveBeenCalledWith('character-id', 'owner', body);
        expect(response.body.data.updatedItems).toEqual([{ id: 'source', cantidad: 0 }, { id: 'target', cantidad: 30 }]);
    });

    it.each([
        { itemId: 'source', targetItemId: '', quantity: 10 },
        { itemId: 'source', quantity: 10 },
        { itemId: 'source', targetItemId: 'target', quantity: 0 },
        { itemId: 'source', targetItemId: 'target', quantity: 1.5 },
    ])('rejects invalid merge request %o', async body => {
        await request(app.getHttpServer()).post('/character/id/inventory/merge').send(body).expect(400);
        expect(service.mergeItems).not.toHaveBeenCalled();
    });

    it('validates the discard path and returns only the deleted ID in data', async () => {
        const result = await request(app.getHttpServer()).delete('/character/character-id/inventory/stack').expect(200);
        expect(service.discardItem).toHaveBeenCalledWith('character-id', 'owner', { itemId: 'stack' });
        expect(result.body).toEqual({ data: { id: 'stack' } });
    });

    it.each([0, -1, 1.5, '10'])('rejects invalid split quantity %s', async quantity => {
        await request(app.getHttpServer()).post('/character/id/inventory/split').send({ itemId: 'stack', quantity }).expect(400);
        expect(service.splitItem).not.toHaveBeenCalled();
    });

    it('requires authentication before discarding', async () => {
        authorized = false;
        await request(app.getHttpServer()).delete('/character/id/inventory/stack').expect(401);
        expect(service.discardItem).not.toHaveBeenCalled();
    });
});
