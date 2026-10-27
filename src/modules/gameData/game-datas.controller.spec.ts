import { INestApplication, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request = require('supertest');
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { CharacterService } from '../character/character.service';
import { CharacterMapper } from '../character/mapper/character-mapper';
import { ATTRIBUTE_RACE_CAPS } from '../character/const/statsProgress/attribute-race-caps.const';
import { ATTRIBUTE_SPECIALITY_CAPS } from '../character/const/statsProgress/attribute-speciality-caps.const';
import { GameDatasController } from './game-datas.controller';
import { GameDatasService } from './game-datas.service';

 describe('GameDatasController config HTTP', () => {
    let app: INestApplication;
    let authenticated: boolean;
    beforeAll(async () => {
        const module = await Test.createTestingModule({ controllers: [GameDatasController], providers: [
            GameDatasService, CharacterMapper, { provide: CharacterService, useValue: {} },
        ] }).overrideGuard(AccessTokenGuard).useValue({ canActivate() {
            if (!authenticated) throw new UnauthorizedException();
            return true;
        } }).compile();
        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();
    });
    beforeEach(() => { authenticated = true; });
    afterAll(async () => { await app?.close(); });

    it('accepts the race alone and omits speciality caps', async () => {
        const response = await request(app.getHttpServer()).get('/game-data/config').query({ race: 'ninja' }).expect(200);
        expect(response.body.data.character.attributeCaps).toEqual({ race: ATTRIBUTE_RACE_CAPS.ninja });
    });

    it('accepts the race and speciality and sends only their caps', async () => {
        const response = await request(app.getHttpServer()).get('/game-data/config')
            .query({ race: 'guerrero', speciality: 'Corporal' }).expect(200);
        expect(response.body.data.character.attributeCaps).toEqual({ race: ATTRIBUTE_RACE_CAPS.guerrero, speciality: ATTRIBUTE_SPECIALITY_CAPS.Corporal });
    });

    it.each([{}, { race: 'invalid' }, { race: 'guerrero', speciality: 'invalid' },
        { race: 'guerrero', speciality: 'Luz' }, { race: 'guerrero', speciality: '' }])('rejects invalid query %o', async query => {
        await request(app.getHttpServer()).get('/game-data/config').query(query).expect(400);
    });

    it('requires authentication', async () => {
        authenticated = false;
        await request(app.getHttpServer()).get('/game-data/config').query({ race: 'guerrero' }).expect(401);
    });
});
