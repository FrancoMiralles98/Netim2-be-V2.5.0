import { BadRequestException, ConflictException, ForbiddenException, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import request = require('supertest');
import { AccessTokenGuard } from '../../../auth/guards/access-token.guard';
import { HistorialService } from '../../../historial/historial.service';
import { CharacterHistorialController } from '../../controller/character-historial.controller';
import { CharacterMapper } from '../../mapper/character-mapper';
import { CharacterRepository } from '../../repository/character-repository';
import { GENERAL_CHARACTER } from '../../const/general-character.const';
import { POCION_LIST } from '../../../item/const/miscs/pocion/pocion-list.const';
import { CharacterHistorialService } from './character-historial.service';
import { CharacterHistorialOrchestratorService } from './character-historial-orchestrator.service';

describe('CharacterHistorialOrchestratorService', () => {
    let app: INestApplication;
    let service: CharacterHistorialOrchestratorService;
    const characterId = '507f1f77bcf86cd799439011';
    const historialId = '507f1f77bcf86cd799439012';
    const selection = { historialId, rewardIds: ['reward'] };
    const session = { withTransaction: jest.fn(async callback => callback()), endSession: jest.fn() };
    const repository = { getCharacterById: jest.fn(), updateCharacterById: jest.fn() };
    const histories = { prepareRewards: jest.fn(), confirmRewards: jest.fn() };

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            controllers: [CharacterHistorialController],
            providers: [CharacterHistorialService, CharacterHistorialOrchestratorService,
                { provide: CharacterRepository, useValue: repository },
                { provide: CharacterMapper, useValue: { fromDb: document => document } },
                { provide: HistorialService, useValue: histories },
                { provide: getConnectionToken(), useValue: { startSession: async () => session } }],
        }).overrideGuard(AccessTokenGuard).useValue({ canActivate: context => {
            context.switchToHttp().getRequest().user = { accountId: 'owner' };
            return true;
        } }).compile();
        service = module.get(CharacterHistorialOrchestratorService);
        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();
    });
    afterAll(async () => { await app.close(); });

    beforeEach(() => {
        jest.clearAllMocks();
        repository.getCharacterById.mockResolvedValue({ ...structuredClone(GENERAL_CHARACTER), inventario: [], user_owner: 'owner' });
        repository.updateCharacterById.mockResolvedValue({});
        histories.prepareRewards.mockResolvedValue({ historialId, rewards: [
            { rewardId: 'reward', item: { ...structuredClone(POCION_LIST[0]), cantidad: 2 } },
        ] });
        histories.confirmRewards.mockResolvedValue({ historialId, claimedRewardIds: ['reward'], pendingItems: [], remainingReward: false });
    });

    it('expone la ruta y comparte la transacción entre el inventario y el historial', async () => {
        const { body } = await request(app.getHttpServer()).post(`/character/${characterId}/historial/claim`)
            .send(selection).expect(200);
        expect(body.data).toMatchObject({ historialId, claimedRewardIds: ['reward'], remainingReward: false,
            newItems: [expect.objectContaining({ cantidad: 2 })], updatedItems: [] });
        expect(histories.prepareRewards).toHaveBeenCalledWith(selection, characterId, session);
        expect(histories.confirmRewards).toHaveBeenCalledWith(selection, characterId, session);
        expect(repository.updateCharacterById).toHaveBeenCalledWith(characterId, { inventario: body.data.newItems }, session);
        expect(session.endSession).toHaveBeenCalledTimes(1);
    });

    it('rechaza un personaje ajeno antes de consultar recompensas', async () => {
        repository.getCharacterById.mockResolvedValueOnce({ user_owner: 'other' });
        await expect(service.claimRewards(characterId, 'owner', selection)).rejects.toBeInstanceOf(ForbiddenException);
        expect(histories.prepareRewards).not.toHaveBeenCalled();
        expect(repository.updateCharacterById).not.toHaveBeenCalled();
    });

    it('no guarda inventario cuando alguna recompensa ya no está pendiente', async () => {
        histories.prepareRewards.mockRejectedValueOnce(new ConflictException());
        await expect(service.claimRewards(characterId, 'owner', selection)).rejects.toBeInstanceOf(ConflictException);
        expect(repository.updateCharacterById).not.toHaveBeenCalled();
        expect(histories.confirmRewards).not.toHaveBeenCalled();
        expect(session.endSession).toHaveBeenCalledTimes(1);
    });

    it('no guarda ni retira pendientes cuando no entra el lote completo', async () => {
        const item = { ...structuredClone(POCION_LIST[0]), cantidad: 1, acc: false, size: { rows: 1, cols: 1 } };
        repository.getCharacterById.mockResolvedValueOnce({ ...structuredClone(GENERAL_CHARACTER), user_owner: 'owner',
            inventario: Array.from({ length: 113 }, (_, i) => ({ ...item, id: String(i),
                position: { row: Math.floor(i / 19), col: i % 19 } })),
        });
        histories.prepareRewards.mockResolvedValueOnce({ historialId, rewards: [
            { rewardId: 'a', item }, { rewardId: 'b', item },
        ] });
        await expect(service.claimRewards(characterId, 'owner', { historialId, rewardIds: ['a', 'b'] }))
            .rejects.toBeInstanceOf(BadRequestException);
        expect(repository.updateCharacterById).not.toHaveBeenCalled();
        expect(histories.confirmRewards).not.toHaveBeenCalled();
    });

    it('propaga conflictos de confirmación para abortar la transacción', async () => {
        histories.confirmRewards.mockRejectedValueOnce(new ConflictException());
        await expect(service.claimRewards(characterId, 'owner', selection)).rejects.toBeInstanceOf(ConflictException);
        expect(session.withTransaction).toHaveBeenCalledTimes(1);
        expect(session.endSession).toHaveBeenCalledTimes(1);
    });

    it.each([[], ['reward', 'reward'], [''], [42]].map(rewardIds => ({ rewardIds })))('rechaza selecciones inválidas: %j', async ({ rewardIds }) => {
        await request(app.getHttpServer()).post(`/character/${characterId}/historial/claim`)
            .send({ historialId, rewardIds }).expect(400);
        expect(repository.getCharacterById).not.toHaveBeenCalled();
    });
});
