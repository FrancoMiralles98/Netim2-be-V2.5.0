import { INestApplication, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request = require('supertest');
import { IdMob, UNIQUE_ID_SKILLS } from 'netim2-shared';
import { SkillModule } from '../../../skill/skill.module';
import { SkillService } from '../../../skill/skill.service';
import { AccessTokenGuard } from '../../../auth/guards/access-token.guard';
import { CharacterFightController } from '../../controller/character-fight.controller';
import { CharacterFightOrchestratorService } from './character-fight-orchestrator.service';
import { CharacterFightService } from './character-fight.service';
import { CharacterRepository } from '../../repository/character-repository';
import { CharacterMapper } from '../../mapper/character-mapper';
import { GENERAL_CHARACTER } from '../../const/general-character.const';
import { CharacterBuffService } from '../item-use/character-buff.service';
import { MobInfoService } from '../../../mob/services/mob-info.service';
import { MobFactory } from '../../../mob/factory/mob.factory';
import { CITY1_MOB_LIST } from '../../../mob/const/list/city1-mobs.list';
import { FighterCombatFactory } from '../../../fight/factories/fighter-combat-entity.factory';
import { FightService } from '../../../fight/fight.service';

describe('CharacterFightController', () => {
    let app: INestApplication;
    const characterId = '507f1f77bcf86cd799439011';
    const source = { ...structuredClone(GENERAL_CHARACTER), user_owner: 'owner' };
    const repository = { getCharacterById: jest.fn(async () => source) };
    const fights = { fightMob: jest.fn(() => ({ result: 'fight-result' })) };
    const guard = { canActivate: jest.fn(context => {
        context.switchToHttp().getRequest().user = { accountId: 'owner' };
        return true;
    }) };

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            controllers: [CharacterFightController],
            providers: [CharacterFightOrchestratorService, CharacterMapper,
                { provide: CharacterRepository, useValue: repository },
                { provide: CharacterFightService, useValue: fights }],
        }).overrideGuard(AccessTokenGuard).useValue(guard).compile();
        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
        await app.init();
    });
    afterAll(async () => { await app.close(); });
    beforeEach(() => jest.clearAllMocks());

    it('carga el personaje una sola vez y devuelve la pelea', async () => {
        const { body } = await request(app.getHttpServer()).post('/character/' + characterId + '/fight/mob')
            .send({ idMob: IdMob.PERRO_SALVAJE, quantity: 3 }).expect(200);
        expect(body).toEqual({ data: { result: 'fight-result' } });
        expect(repository.getCharacterById).toHaveBeenCalledTimes(1);
        expect(fights.fightMob).toHaveBeenCalledWith(
            expect.objectContaining({ id: characterId }), { idMob: IdMob.PERRO_SALVAJE, quantity: 3 },
        );
    });

    it('rechaza un personaje ajeno antes de ejecutar la pelea', async () => {
        repository.getCharacterById.mockResolvedValueOnce({ ...source, user_owner: 'other' });
        await request(app.getHttpServer()).post('/character/' + characterId + '/fight/mob')
            .send({ idMob: IdMob.PERRO_SALVAJE, quantity: 3 }).expect(403);
        expect(fights.fightMob).not.toHaveBeenCalled();
    });

    it.each([{}, { idMob: 999999 }, { idMob: 'abc' }, { idMob: -1 }])('valida el mob solicitado %o', async body => {
        await request(app.getHttpServer()).post('/character/' + characterId + '/fight/mob').send(body).expect(400);
        expect(repository.getCharacterById).not.toHaveBeenCalled();
    });

    it.each([undefined, 0, -1, 1.5, '3', Number.MAX_SAFE_INTEGER + 1])('rechaza cantidad inválida %s', async quantity => {
        await request(app.getHttpServer()).post('/character/' + characterId + '/fight/mob')
            .send({ idMob: IdMob.PERRO_SALVAJE, quantity }).expect(400);
        expect(repository.getCharacterById).not.toHaveBeenCalled();
    });

    it('valida el ID del personaje', async () => {
        await request(app.getHttpServer()).post('/character/invalid/fight/mob').send({ idMob: 1, quantity: 1 }).expect(400);
    });

    it('requiere autenticación', async () => {
        guard.canActivate.mockImplementationOnce(() => { throw new UnauthorizedException(); });
        await request(app.getHttpServer()).post('/character/' + characterId + '/fight/mob')
            .send({ idMob: 1, quantity: 1 }).expect(401);
    });
});

describe('CharacterFightService', () => {
    it('crea la cantidad solicitada con IDs y stats independientes', () => {
        const character = { ...structuredClone(GENERAL_CHARACTER), id: 'character' };
        character.stats.general.hp = { max: 1000, actual: 1000 };
        const mob = new MobFactory().create(CITY1_MOB_LIST[0]);
        const buffs = { refreshBuffs: jest.fn(() => ({ character: structuredClone(character) })) };
        const mobs = { getMobInfo: jest.fn(() => mob) };
        const fighters = new FighterCombatFactory();
        const createSides = jest.spyOn(fighters, 'createSidesWithMobs');
        const fights = { fight: jest.fn() };
        const service = new CharacterFightService(buffs as unknown as CharacterBuffService,
            mobs as unknown as MobInfoService, fighters, fights as unknown as FightService, {} as SkillService);

        service.fightMob(character, { idMob: mob.idMob, quantity: 3 });

        const instances = createSides.mock.calls[0][1];
        const { enemies } = createSides.mock.results[0].value;
        expect(instances).toHaveLength(3);
        expect(enemies).toHaveLength(3);
        expect(new Set(enemies.map(enemy => enemy.id)).size).toBe(3);
        instances[0].stats.general.hp.max = 0;
        expect(instances[1].stats.general.hp.max).toBe(mob.stats.general.hp.max);
        expect(mobs.getMobInfo).toHaveBeenCalledTimes(1);
        expect(fights.fight).toHaveBeenCalledWith(expect.any(Array), enemies);
    });

    it('recalcula Bendición guardada con modificadores vacíos antes de crear los combatientes', async () => {
        const module = await Test.createTestingModule({ imports: [SkillModule] }).compile();
        try {
            const character = { ...structuredClone(GENERAL_CHARACTER), id: 'character' };
            character.raza = 'chaman';
            character.especialidad = 'Dragon';
            character.stats.general.hp = { max: 1000, actual: 1000 };
            const aura = module.get(SkillService).getSpecialitySkillPool('Dragon')
                .find(skill => skill.id === UNIQUE_ID_SKILLS.BENDICION)!;
            const saved = { ...structuredClone(aura), mastery: 'N' as const, lv: 1 };
            if (saved.type !== 'aura') throw new Error('Bendición debe ser un aura');
            saved.statsModifiers = [];
            character.hab = [saved];
            const buffs = { refreshBuffs: () => ({ character: structuredClone(character) }) };
            const mob = new MobFactory().create(CITY1_MOB_LIST[0]);
            const mobs = { getMobInfo: () => mob };
            const fighters = new FighterCombatFactory();
            const createSides = jest.spyOn(fighters, 'createSidesWithMobs');
            const fights = { fight: jest.fn() };
            const service = new CharacterFightService(buffs as unknown as CharacterBuffService,
                mobs as unknown as MobInfoService, fighters, fights as unknown as FightService, module.get(SkillService));

            service.fightMob(character, { idMob: mob.idMob, quantity: 1 });

            const calculated = createSides.mock.calls[0][0][0].hab[0];
            expect(calculated.type).toBe('aura');
            if (calculated.type !== 'aura') throw new Error('Debe conservar el tipo aura');
            expect(calculated.statsModifiers).toEqual(expect.arrayContaining([
                expect.objectContaining({ target: 'bonus.defensa.def_media', operation: 'flat', value: 10 }),
            ]));
            expect(calculated.mana).not.toEqual(saved.mana);
            expect(character.hab[0]).toEqual(saved);
        } finally {
            await module.close();
        }
    });
});
