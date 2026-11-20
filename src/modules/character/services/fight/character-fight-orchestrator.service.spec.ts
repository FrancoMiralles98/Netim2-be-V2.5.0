import { INestApplication, UnauthorizedException, ValidationPipe, ConflictException } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import request = require('supertest');
import type { FightResponse, ItemDTO } from 'netim2-shared';
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
import { HistorialService } from '../../../historial/historial.service';
import { DropService } from '../../../drop/drop.service';
import { CharacterFightTimerService } from './character-fight-timer.service';
import { POCION_LIST } from '../../../item/const/miscs/pocion/pocion-list.const';
import type { FighterCombatEntity } from '../../../fight/entities/fighter-combat.entity';

describe('CharacterFightController', () => {
    let app: INestApplication;
    const characterId = '507f1f77bcf86cd799439011';
    const source = { ...structuredClone(GENERAL_CHARACTER), user_owner: 'owner' };
    const repository = { getCharacterById: jest.fn(async () => source), updateCharacterById: jest.fn() };
    const result = { character: source, response: { result: 'fight-result', character: { exp: 10 } },
        historial: { fightId: 'fight' } };
    const fights = { fightMob: jest.fn(() => result) };
    const histories = { saveHistorial: jest.fn(async () => ({ id: 'history' })) };
    const session = { withTransaction: async <T>(fn: () => Promise<T>) => fn(), endSession: jest.fn() };
    const guard = { canActivate: jest.fn(context => {
        context.switchToHttp().getRequest().user = { accountId: 'owner' };
        return true;
    }) };

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            controllers: [CharacterFightController],
            providers: [CharacterFightOrchestratorService, CharacterMapper,
                { provide: getConnectionToken(), useValue: { startSession: async () => session } },
                { provide: HistorialService, useValue: histories },
                { provide: CharacterRepository, useValue: repository },
                { provide: CharacterFightService, useValue: fights }],
        }).overrideGuard(AccessTokenGuard).useValue(guard).compile();
        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
        await app.init();
    });
    afterAll(async () => { await app.close(); });
    beforeEach(() => jest.clearAllMocks());

    it('guarda personaje e historial en la misma sesión y devuelve el resultado ampliado', async () => {
        const { body } = await request(app.getHttpServer()).post('/character/' + characterId + '/fight/mob')
            .send({ idMob: IdMob.PERRO_SALVAJE, quantity: 3 }).expect(200);
        expect(body).toEqual({ data: { ...result.response, historialId: 'history' } });
        expect(repository.getCharacterById).toHaveBeenCalledWith(characterId, session);
        expect(repository.updateCharacterById).toHaveBeenCalledWith(characterId, result.response.character, session);
        expect(histories.saveHistorial).toHaveBeenCalledWith(result.historial, characterId, session);
        expect(session.endSession).toHaveBeenCalledTimes(1);
    });

    it('rechaza un personaje ajeno antes de ejecutar la pelea', async () => {
        repository.getCharacterById.mockResolvedValueOnce({ ...source, user_owner: 'other' });
        await request(app.getHttpServer()).post('/character/' + characterId + '/fight/mob')
            .send({ idMob: IdMob.PERRO_SALVAJE, quantity: 3 }).expect(403);
        expect(fights.fightMob).not.toHaveBeenCalled();
        expect(repository.updateCharacterById).not.toHaveBeenCalled();
    });

    it.each([undefined, 0, -1, 1.5, '3'])('rechaza cantidad inválida %s', async quantity => {
        await request(app.getHttpServer()).post('/character/' + characterId + '/fight/mob')
            .send({ idMob: IdMob.PERRO_SALVAJE, quantity }).expect(400);
        expect(repository.getCharacterById).not.toHaveBeenCalled();
    });

    it('requiere autenticación', async () => {
        guard.canActivate.mockImplementationOnce(() => { throw new UnauthorizedException(); });
        await request(app.getHttpServer()).post('/character/' + characterId + '/fight/mob')
            .send({ idMob: 1, quantity: 1 }).expect(401);
    });
});

describe('CharacterFightService', () => {
    const mapper = new CharacterMapper();
    const timers = new CharacterFightTimerService();
    const makeCharacter = () => {
        const character = { ...structuredClone(GENERAL_CHARACTER), id: 'character' };
        character.stats.general.hp = { max: 1000, actual: 1000 };
        character.timer_mob = character.timer_metin = character.timer_boss = 0;
        character.timer_lv = 15;
        character.hab = [];
        character.exp = character.exp_next_lv - 1;
        return character;
    };
    const response = (allies: FighterCombatEntity[], enemies: FighterCombatEntity[], won: boolean): FightResponse => ({
        result: { outcome: 'winner', winnerSide: won ? 'allies' : 'enemies',
            winnerFighterIds: won ? [allies[0].id] : enemies.map(enemy => enemy.id),
            survivingFighterIds: won ? [allies[0].id] : enemies.map(enemy => enemy.id),
            defeatedFighterIds: won ? enemies.map(enemy => enemy.id) : [allies[0].id],
            reason: 'team_defeated', finishedOnTurn: 1 },
        initialFighters: [], initiativeResults: [], fightPlaybackPayload: { fightId: 'fight', turns: [] },
        fighterFightSummary: [...allies, ...enemies].map(fighter => ({
            fighterId: fighter.id, name: fighter.name, side: allies.includes(fighter) ? 'allies' : 'enemies',
            alive: won === allies.includes(fighter), resources: { hp: won === allies.includes(fighter) ? 100 : 0, mana: 0 },
            statistics: fighter.statistics.toSnapshot(),
        })),
    });

    it.each([true, false])('liquida victoria=%s y mantiene los drops pendientes fuera del inventario', won => {
        const character = makeCharacter();
        const original = structuredClone(character);
        const mob = new MobFactory().create(CITY1_MOB_LIST[0]);
        const buffs = { refreshBuffs: (value: typeof character) => ({ character: structuredClone(value) }) };
        const mobs = { getMobInfo: () => mob };
        const fighters = new FighterCombatFactory();
        const createSides = jest.spyOn(fighters, 'createSidesWithMobs');
        const fights = { fight: jest.fn((allies, enemies) => response(allies, enemies, won)) };
        const drops = { generateMobDrop: jest.fn(() => ({ exp: 1, yang: 10, items: [POCION_LIST[0]] as ItemDTO[] })) };
        const service = new CharacterFightService(buffs as unknown as CharacterBuffService, mobs as unknown as MobInfoService,
            fighters, fights as unknown as FightService, {} as SkillService, drops as unknown as DropService, mapper, timers);
        const result = service.fightMob(character, { idMob: mob.idMob, quantity: 3 });
        expect(result.response.yang).toBe(won ? 30 : 0);
        expect(result.response.exp).toBe(won ? 3 : 0);
        expect(result.response.items).toHaveLength(won ? 3 : 0);
        expect(drops.generateMobDrop).toHaveBeenCalledTimes(won ? 3 : 0);
        expect(result.character.yang).toBe(character.yang + (won ? 30 : 0));
        expect(result.character.lv).toBe(character.lv + (won ? 1 : 0));
        expect(result.character.puntos_habilidad).toBe(character.puntos_habilidad + (won ? 1 : 0));
        expect(result.character.inventario).toEqual(character.inventario);
        expect(result.character.timer_mob).toBeGreaterThan(Date.now());
        expect(result.historial.rewards.pendingItems).toEqual(result.response.items);
        expect(result.historial.fight).toEqual(result.response.fighterFightSummary);
        expect(result.historial.enemies).toHaveLength(3);
        expect(new Set(createSides.mock.results[0].value.enemies.map(enemy => enemy.id)).size).toBe(3);
        expect(character).toEqual(original);
    });

    it.each([
        ['mob', 'timer_mob', 15000], ['netim', 'timer_metin', 30000], ['boss', 'timer_boss', 60000],
    ] as const)('aplica el cooldown de %s antes de permitir otra pelea', (type, key, duration) => {
        const character = makeCharacter();
        timers.applyTimer(character, type, 100000);
        expect(character[key]).toBe(100000 + duration);
        expect(() => timers.applyTimer(character, type, 100001)).toThrow(ConflictException);
        timers.applyTimer(character, type, 100000 + duration);
        expect(character[key]).toBe(100000 + duration * 2);
    });

    it('aplica la reducción del timer y rechaza el combate antes de ejecutar el motor si sigue activo', () => {
        const character = makeCharacter();
        character.stats.bonus.miscs.time_reduction = 20;
        timers.applyTimer(character, 'mob', 100000);
        expect(character.timer_mob).toBe(112000);
        character.timer_mob = Date.now() + 60000;
        const buffs = { refreshBuffs: () => ({ character: structuredClone(character) }) };
        const mobs = { getMobInfo: () => new MobFactory().create(CITY1_MOB_LIST[0]) };
        const fights = { fight: jest.fn() };
        const service = new CharacterFightService(buffs as unknown as CharacterBuffService, mobs as unknown as MobInfoService,
            new FighterCombatFactory(), fights as unknown as FightService, {} as SkillService,
            {} as DropService, mapper, timers);
        expect(() => service.fightMob(character, { idMob: IdMob.PERRO_SALVAJE, quantity: 1 })).toThrow(ConflictException);
        expect(fights.fight).not.toHaveBeenCalled();
    });

    it('recalcula Bendición guardada con modificadores vacíos antes de crear los combatientes', async () => {
        const module = await Test.createTestingModule({ imports: [SkillModule] }).compile();
        try {
            const character = makeCharacter();
            character.raza = 'chaman';
            character.especialidad = 'Dragon';
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
            const fights = { fight: (allies, enemies) => response(allies, enemies, false) };
            const service = new CharacterFightService(buffs as unknown as CharacterBuffService,
                mobs as unknown as MobInfoService, fighters, fights as unknown as FightService, module.get(SkillService),
                {} as DropService, mapper, timers);
            service.fightMob(character, { idMob: mob.idMob, quantity: 1 });
            const calculated = createSides.mock.calls[0][0][0].hab[0];
            if (calculated.type !== 'aura') throw new Error('Debe conservar el tipo aura');
            expect(calculated.statsModifiers).toEqual(expect.arrayContaining([
                expect.objectContaining({ target: 'bonus.defensa.def_media', operation: 'flat', value: 10 }),
            ]));
            expect(character.hab[0]).toEqual(saved);
        } finally {
            await module.close();
        }
    });
});
