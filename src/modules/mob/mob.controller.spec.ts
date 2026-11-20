import { INestApplication, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request = require('supertest');
import { IdMob, type MobDropPreview } from 'netim2-shared';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { MobDropPreviewService } from '../drop/service/mob-drop-preview.service';
import { POCION_LIST } from '../item/const/miscs/pocion/pocion-list.const';
import { ApiResponseInterceptor } from '../shared/interceptors/api-response.interceptor';
import { ApiExceptionFilter } from '../shared/filters/api-exception.filter';
import { MobController } from './mob.controller';
import { MobFactory } from './factory/mob.factory';
import { MOB_LIST } from './const/mob-list.const';
import { MobInfoService } from './services/mob-info.service';
import { MobOrchestratorService } from './services/mob-orchestrator.service';

describe('GET /mob/:idMob', () => {
  let app: INestApplication;
  const guard = { canActivate: jest.fn(() => true) };
  const drop: MobDropPreview = [{
    type: 'utility', item: POCION_LIST[0], chancePerAttempt: 10, chancePerKill: 20,
    chanceChange: 'unchanged', quantityRange: { min: 1, max: 20 }, dropWeight: 'COMMON',
  }];
  const dropPreview = { getMobDropPreview: jest.fn(() => drop) };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [MobController],
      providers: [MobFactory, MobInfoService, MobOrchestratorService,
        { provide: MobDropPreviewService, useValue: dropPreview }],
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

  it('returns the full catalog mob and its base drops in the API envelope', async () => {
    const { body } = await request(app.getHttpServer()).get(`/mob/${IdMob.PERRO_SALVAJE}`).expect(200);
    expect(body).toMatchObject({ success: true, message: 'Ok', data: {
      mob: { idMob: IdMob.PERRO_SALVAJE, nombre: 'Perro Salvaje',
        stats: { general: { hp: new MobFactory().create(MOB_LIST[0]).stats.general.hp } } },
      drop,
    } });
    expect(body.data.mob).toHaveProperty('fightConfig');
    expect(body.data.mob).toHaveProperty('spawnConfig');
    expect(body.data.mob).not.toHaveProperty('combatProfile');
    expect(body.data.mob).not.toHaveProperty('_id');
    expect(dropPreview.getMobDropPreview).toHaveBeenCalledWith(
      expect.objectContaining({ idMob: IdMob.PERRO_SALVAJE }),
      expect.objectContaining({ chances_objetos: 0, chances_yang: 0, chances_raros: 0 }),
    );
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
