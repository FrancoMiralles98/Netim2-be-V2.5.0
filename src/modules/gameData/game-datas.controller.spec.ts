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
import { CHARACTER_SPECIALITYS } from '../character/const/character-specialitys.const';
import { ALL_SKILLS } from '../skill/const/skills';

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

    it('accepts the race alone and includes all enabled specialities and their skill IDs', async () => {
        const response = await request(app.getHttpServer()).get('/game-data/config').query({ race: 'ninja' }).expect(200);
        expect(response.body.data.character).toEqual({
            race: ATTRIBUTE_RACE_CAPS.ninja,
            speciality: CHARACTER_SPECIALITYS.ninja.map(specialidad => ({ specialidad, caps: ATTRIBUTE_SPECIALITY_CAPS[specialidad] })),
            idSkillsSpeciality: CHARACTER_SPECIALITYS.ninja.map(specialidad => ({ specialidad, idSkills: ALL_SKILLS[specialidad].map(skill => skill.id) })),
        });
    });

    it('keeps all race specialities when a valid selected speciality is supplied', async () => {
        const response = await request(app.getHttpServer()).get('/game-data/config')
            .query({ race: 'guerrero', speciality: 'Corporal' }).expect(200);
        expect(response.body.data.character.race).toEqual(ATTRIBUTE_RACE_CAPS.guerrero);
        expect(response.body.data.character.speciality).toEqual([
            { specialidad: 'Corporal', caps: ATTRIBUTE_SPECIALITY_CAPS.Corporal },
            { specialidad: 'Mental', caps: ATTRIBUTE_SPECIALITY_CAPS.Mental },
        ]);
        expect(response.body.data.character.idSkillsSpeciality.map(entry => entry.specialidad)).toEqual(['Corporal', 'Mental']);
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
