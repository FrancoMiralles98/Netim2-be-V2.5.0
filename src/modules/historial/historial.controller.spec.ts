import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request = require('supertest');
import { HistorialController } from './historial.controller';
import { HistorialQueryService } from './services/historial-query.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';

describe('HistorialController', () => {
    let app: INestApplication;
    const characterId = '507f1f77bcf86cd799439011';
    const historialId = '507f1f77bcf86cd799439012';
    const queries = { getPartialsHistoriales: jest.fn(), getHistorialById: jest.fn() };

    beforeEach(async () => {
        jest.clearAllMocks();
        const module = await Test.createTestingModule({
            controllers: [HistorialController],
            providers: [{ provide: HistorialQueryService, useValue: queries }],
        }).overrideGuard(AccessTokenGuard).useValue({
            canActivate: context => {
                context.switchToHttp().getRequest().user = { accountId: 'account' };
                return true;
            },
        }).compile();
        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();
    });

    afterEach(async () => { await app.close(); });

    it('lista los resúmenes con la cuenta autenticada y el filtro solicitado', async () => {
        queries.getPartialsHistoriales.mockResolvedValue([]);
        await request(app.getHttpServer()).get(`/historial/${characterId}/partials?filtro=pvm`)
            .expect(200).expect({ data: [] });
        expect(queries.getPartialsHistoriales).toHaveBeenCalledWith(characterId, 'account', 'pvm');
    });

    it('consulta el detalle delimitado por personaje e historial', async () => {
        queries.getHistorialById.mockResolvedValue({ id: historialId });
        await request(app.getHttpServer()).get(`/historial/${characterId}/${historialId}`)
            .expect(200).expect({ data: { id: historialId } });
        expect(queries.getHistorialById).toHaveBeenCalledWith(historialId, characterId, 'account');
    });

    it('rechaza filtros e identificadores inválidos antes de consultar', async () => {
        await request(app.getHttpServer()).get(`/historial/${characterId}/partials?filtro=otro`).expect(400);
        await request(app.getHttpServer()).get('/historial/invalido/partials').expect(400);
        await request(app.getHttpServer()).get(`/historial/${characterId}/invalido`).expect(400);
        expect(queries.getPartialsHistoriales).not.toHaveBeenCalled();
        expect(queries.getHistorialById).not.toHaveBeenCalled();
    });
});
