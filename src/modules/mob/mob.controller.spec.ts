import { INestApplication, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request = require('supertest');
import { IdMob } from 'netim2-shared';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { ApiResponseInterceptor } from '../shared/interceptors/api-response.interceptor';
import { ApiExceptionFilter } from '../shared/filters/api-exception.filter';
import { MobController } from './mob.controller';
import { MobFactory } from './factory/mob.factory';
import { MobInfoService } from './services/mob-info.service';
import { MobOrchestratorService } from './services/mob-orchestrator.service';

describe('GET /mob/:idMob', () => {
  let app: INestApplication;
  const guard = { canActivate: jest.fn(() => true) };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [MobController],
      providers: [MobFactory, MobInfoService, MobOrchestratorService],
    }).overrideGuard(AccessTokenGuard).useValue(guard).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    app.useGlobalInterceptors(new ApiResponseInterceptor());
    app.useGlobalFilters(new ApiExceptionFilter());
    await app.init();
  });

  afterAll(async () => { await app.close(); });

  it('lists only the six summary fields for the requested location', async () => {
    const { body } = await request(app.getHttpServer()).get('/mob?ubication=city1').expect(200);
    expect(body).toEqual({ success: true, message: 'Ok', data: [{
      idMob: IdMob.PERRO_SALVAJE, dificultad: 1, ubication: 'city1',
      nombre: 'Perro Salvaje', lv: 1, enemie_type: 'mob',
    }] });
  });

  it('returns an empty list for a valid location without catalog mobs', async () => {
    const { body } = await request(app.getHttpServer()).get('/mob?ubication=city2').expect(200);
    expect(body.data).toEqual([]);
  });

  it.each(['/mob', '/mob?ubication=', '/mob?ubication=unknown', '/mob?ubication=city1&ubication=city2'])(
    'rejects an absent or invalid location: %s', async url => {
      await request(app.getHttpServer()).get(url).expect(400);
    },
  );

  it('returns the full catalog mob with calculated stats in the API envelope', async () => {
    const { body } = await request(app.getHttpServer()).get(`/mob/${IdMob.PERRO_SALVAJE}`).expect(200);
    expect(body).toMatchObject({ success: true, message: 'Ok', data: {
      idMob: IdMob.PERRO_SALVAJE, nombre: 'Perro Salvaje',
      stats: { general: { hp: { max: 120, actual: 120 } } },
    } });
    expect(body.data).toHaveProperty('fightConfig');
    expect(body.data).toHaveProperty('spawnConfig');
    expect(body.data).not.toHaveProperty('combatProfile');
    expect(body.data).not.toHaveProperty('_id');
  });

  it.each(['abc', '0', '-1', '1.5', '9007199254740992'])('rejects invalid id %s', async id => {
    const { body } = await request(app.getHttpServer()).get(`/mob/${id}`).expect(400);
    expect(body.success).toBe(false);
  });

  it('returns 404 for an ID absent from the catalog', async () => {
    await request(app.getHttpServer()).get('/mob/999999').expect(404);
  });

  it('requires the access guard before returning mob data', async () => {
    guard.canActivate.mockImplementationOnce(() => { throw new UnauthorizedException(); });
    await request(app.getHttpServer()).get('/mob/1').expect(401);
  });
});
