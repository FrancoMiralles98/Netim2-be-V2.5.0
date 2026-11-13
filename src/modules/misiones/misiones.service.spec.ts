import { ConflictException } from '@nestjs/common';
import type { ClientSession, Connection } from 'mongoose';
import { IdItem, IdMissionsList, IdMob, type MissionDefinition } from 'netim2-shared';
import { GENERAL_CHARACTER } from '../character/const/general-character.const';
import { CharacterMapper } from '../character/mapper/character-mapper';
import type { CharacterRepository } from '../character/repository/character-repository';
import type { CharacterBuffService } from '../character/services/item-use/character-buff.service';
import { ESPADA_LIST } from '../item/const/equip/weapons/espada-list.const';
import { POCION_LIST } from '../item/const/miscs/pocion/pocion-list.const';
import type { ItemService } from '../item/item.service';
import type { MobService } from '../mob/mob.service';
import { MISSION_LIST, MISSIONS_BY_ID } from './const';
import { MisionesService } from './misiones.service';
import { MissionCatalogService } from './services/mission-catalog.service';
import { MissionOrchestratorService } from './services/mission-orchestrator.service';
import { MissionProgressService } from './services/mission-progress.service';
import { MissionRewardService } from './services/mission-reward.service';
import { readMissionOption } from './services/utils/read-mission-option';

describe('Misiones', () => {
    const progress = new MissionProgressService();
    const mapper = new CharacterMapper();
    const items = { getItems: jest.fn(() => [{ ...ESPADA_LIST[0], upgradeLv: 3 }]) };
    const rewards = new MissionRewardService(items as unknown as ItemService);
    const mobs = { getMobsByIdMobs: jest.fn(async (_ids: IdMob[]) => [
        { idMob: IdMob.PERRO_SALVAJE, nombre: 'Perro Salvaje' },
    ]) };
    const catalog = new MissionCatalogService(progress, rewards, mobs as unknown as MobService);
    const missions = new MisionesService(catalog, progress);
    const id = IdMissionsList.UN_NUEVO_COMIENZO;
    const now = new Date('2026-11-11T13:00:00Z');
    const action = { type: 'action', action: { event: 'skill_upgraded' } } as const;
    const definition: MissionDefinition = {
        id, name: 'Prueba de misión', description: '', category: 'main', owner: 'capitan',
        timeLimitSeconds: 60, sequentialSteps: true,
        rewards: [{ type: 'yang', amount: 100 }, { type: 'item', itemId: IdItem.ESPADA, quantity: 2, upgradeLv: 3 },
            { type: 'exp', amount: 1 }],
        steps: [
            { id: 10, objectives: [{ id: 1, quantity: 1, ...action }] },
            { id: 20, objectives: [{ id: 2, quantity: 1, ...action }] },
        ],
    };

    const source = () => structuredClone(GENERAL_CHARACTER);
    const start = () => missions.accept(source(), id, now);
    const installDefinition = () => jest.spyOn(MISSIONS_BY_ID, 'get').mockImplementation(key =>
        key === id ? definition : MISSION_LIST.find(mission => mission.id === key));
    afterEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    it('conserva los IDs del catálogo y bloquea tutoriales con prerrequisitos pendientes', async () => {
        expect(MISSIONS_BY_ID.size).toBe(67);
        const character = source();
        expect((await catalog.list(character, now)).available.some(entry => entry.id === IdMissionsList.CONOCETE_A_TI_MISMO)).toBe(false);
        character.mission_option.idMissionsDone.push(id);
        expect((await catalog.list(character, now)).available.some(entry => entry.id === IdMissionsList.CONOCETE_A_TI_MISMO)).toBe(true);
    });

    it('incluye nombres de objetivos y consulta cada ID de mob una sola vez por listado', async () => {
        const character = source();
        character.lv = 2;
        character.mission_option.idMissionsDone.push(IdMissionsList.CONOCETE_A_TI_MISMO);
        const { available } = await catalog.list(character, now);
        expect(mobs.getMobsByIdMobs).toHaveBeenCalledTimes(1);
        const [ids] = mobs.getMobsByIdMobs.mock.calls[0];
        expect(ids.filter(id => id === IdMob.PERRO_SALVAJE)).toHaveLength(1);
        expect(available.find(entry => entry.id === id)?.steps[0].objectives[0]).toMatchObject({
            mobs: [{ idMob: IdMob.PERRO_SALVAJE, name: 'Perro Salvaje' }],
        });
        const herrero = available.find(entry => entry.id === IdMissionsList.UN_FAVOR_DEL_HERRERO);
        expect(herrero?.steps[0].objectives[0]).toMatchObject({
            itemId: IdItem.GARRA_DE_LOBO, itemName: expect.stringMatching(/garra de lobo/i),
        });
    });

    it('convierte el pendiente de caza legado en un contador del objetivo', () => {
        const stored = { idMissionsDone: [], missionsInProgress: [{ idMission: id, missionType: 'hunt',
            missionProgress: { isDone: false, huntsProgress: [{ idMob: IdMob.PERRO_SALVAJE, quantity: 1 }] } }] };
        expect(readMissionOption(stored as unknown as typeof GENERAL_CHARACTER.mission_option).missionsInProgress[0])
            .toMatchObject({ missionId: id, objectivesProgress: [{ objectiveId: 1, count: 2 }] });
    });

    it('guarda el paso nuevo sin volver a contar el evento y permite retirar intentos vencidos', () => {
        installDefinition();
        const character = start();
        const state = progress.register(character, [action], now)!;
        expect(state.missionsInProgress[0]).toMatchObject({ activeStepId: 20, objectivesProgress: [{ objectiveId: 1, count: 1 }] });
        expect(state.missionsInProgress[0].completedAt).toBeUndefined();
        character.mission_option = state;
        const { attemptId, expiresAt } = state.missionsInProgress[0];
        expect(progress.register(character, [action], expiresAt)).toBeUndefined();
        expect(missions.removeFailed(character, { missionId: id, attemptId }, expiresAt!).mission_option.missionsInProgress).toEqual([]);
    });

    it('combina caza con entrega y vuelve a validar el inventario al cobrar', () => {
        const potion = POCION_LIST[0];
        const mixed: MissionDefinition = { ...definition, sequentialSteps: false, steps: [{ id: 1, objectives: [
            { id: 1, type: 'hunt', target: { mobIds: [IdMob.PERRO_SALVAJE] }, quantity: 3 },
            { id: 2, type: 'collect', itemId: potion.idItem, mode: 'inventory', consumeOnClaim: true, quantity: 2 },
        ] }] };
        jest.spyOn(MISSIONS_BY_ID, 'get').mockReturnValue(mixed);
        const character = start();
        character.inventario = [{ ...potion, id: 'materials', cantidad: 2, position: { row: 0, col: 0 } }];
        character.mission_option = progress.register(character, [
            { type: 'hunt', mobId: IdMob.LOBO_ALFA, quantity: 2 },
            { type: 'hunt', mobId: IdMob.PERRO_SALVAJE, quantity: 3 },
        ], now)!;
        expect(character.mission_option.missionsInProgress[0].objectivesProgress).toEqual([{ objectiveId: 1, count: 3 }]);
        expect(progress.status(mixed, character, now)).toBe('ready_to_claim');
        const entity = mapper.toDomain(structuredClone(character));
        rewards.consume(entity, character.inventario, progress.requiredDeliveries(mixed));
        expect(entity.toPrimitives().inventario).toEqual([]);
        character.inventario = [];
        const { attemptId } = character.mission_option.missionsInProgress[0];
        expect(() => missions.prepareClaim(character, { missionId: id, attemptId }, now)).toThrow(ConflictException);
    });

    it.each([true, false])('confirma todas las recompensas juntas cuando hay espacio (%s)', async hasSpace => {
        installDefinition();
        const character = start();
        character.exp = character.exp_next_lv - 1;
        character.mission_option = progress.register(character, [action, action], now)!;
        if (!hasSpace) {
            for (let row = 0; row < 6; row++) for (let col = 0; col < 19; col++) {
                character.inventario.push({ ...POCION_LIST[0], id: `${row}-${col}`, cantidad: 1,
                    size: { rows: 1, cols: 1 }, position: { row, col } });
            }
        }
        let stored = { ...character, user_owner: 'owner' };
        const repository = {
            getCharacterById: jest.fn(async () => stored),
            updateCharacterById: jest.fn(async (_id: string, changes: Partial<typeof stored>) => { stored = { ...stored, ...changes }; }),
        };
        const session = { withTransaction: <T>(fn: () => Promise<T>) => fn(), endSession: jest.fn() };
        const connection = { startSession: async () => session as unknown as ClientSession };
        const buffs = { refreshBuffs: (character: ReturnType<typeof source>) => ({ character }) };
        const orchestrator = new MissionOrchestratorService(repository as unknown as CharacterRepository, mapper, missions,
            catalog, progress, rewards, buffs as unknown as CharacterBuffService, connection as unknown as Connection);
        const request = { missionId: id, attemptId: character.mission_option.missionsInProgress[0].attemptId };
        expect((await catalog.describe(definition, character, now))?.rewards[1]).toMatchObject({
            quantity: 2, item: { idItem: IdItem.ESPADA, upgradeLv: 3 },
        });

        if (!hasSpace) {
            await expect(orchestrator.claim('character', 'owner', request)).rejects.toThrow('No hay espacio suficiente');
            expect(repository.updateCharacterById).not.toHaveBeenCalled();
            expect(stored.mission_option.missionsInProgress).toHaveLength(1);
            return;
        }

        const result = await orchestrator.claim('character', 'owner', request);
        expect(result).toMatchObject({ idMissionsDone: [id], missionsInProgress: [],
            changes: { lv: character.lv + 1, yang: character.yang + 100, puntos_habilidad: character.puntos_habilidad + 1 } });
        expect(result.changes.inventario).toHaveLength(2);
        expect(result.changes.inventario?.every(item => 'upgradeLv' in item && item.upgradeLv === 3)).toBe(true);
        expect(repository.updateCharacterById).toHaveBeenCalledWith('character', expect.objectContaining({
            mission_option: { idMissionsDone: [id], missionsInProgress: [] },
        }), session);
        await expect(orchestrator.claim('character', 'owner', request)).rejects.toThrow(ConflictException);
        expect(repository.updateCharacterById).toHaveBeenCalledTimes(1);
    });
});
