import { INestApplication, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request = require('supertest');
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { GENERAL_CHARACTER } from '../const/general-character.const';
import { CharacterAttributeOrchestratorService } from '../services/atributos/character-attribute-orchestrator.service';
import { CharacterAttributeController } from './character-attribute.controller';

describe('CharacterAttributeController HTTP', () => {
    let app: INestApplication;
    let authenticated: boolean;
    const response = { stats: structuredClone(GENERAL_CHARACTER.stats), attributes: structuredClone(GENERAL_CHARACTER.atributos), puntos_atributos: 1 };
    const service = { increaseAttribute: jest.fn() };
    beforeAll(async () => {
        const module = await Test.createTestingModule({ controllers: [CharacterAttributeController],
            providers: [{ provide: CharacterAttributeOrchestratorService, useValue: service }] })
            .overrideGuard(AccessTokenGuard).useValue({ canActivate(context) {
                if (!authenticated) throw new UnauthorizedException();
                context.switchToHttp().getRequest().user = { accountId: 'owner' };
                return true;
            } }).compile();
        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();
    });
    beforeEach(() => {
        authenticated = true;
        service.increaseAttribute.mockReset().mockResolvedValue(response);
    });
    afterAll(async () => { await app?.close(); });

    it.each(['STR', 'INT', 'DEX', 'VIT'])('accepts %s and uses only the authenticated account and requested attribute', async attribute => {
        const result = await request(app.getHttpServer()).post('/character/character-id/attributes/increase')
            .send({ attribute, accountId: 'forged', quantity: 99, puntos_atributos: 999 })
            .expect(200);
        expect(result.body).toEqual(JSON.parse(JSON.stringify({ data: response })));
        expect(service.increaseAttribute).toHaveBeenCalledWith('character-id', 'owner', { attribute });
    });

    it.each([{}, { attribute: 'str' }, { attribute: 'hp' }, { attribute: null }, { attribute: 1 }, { attribute: ['STR'] }])(
        'rejects invalid bodies %o before calling the orchestrator', async body => {
            await request(app.getHttpServer()).post('/character/id/attributes/increase').send(body).expect(400);
            expect(service.increaseAttribute).not.toHaveBeenCalled();
        },
    );

    it('requires authentication', async () => {
        authenticated = false;
        await request(app.getHttpServer()).post('/character/id/attributes/increase').send({ attribute: 'STR' }).expect(401);
        expect(service.increaseAttribute).not.toHaveBeenCalled();
    });
});
