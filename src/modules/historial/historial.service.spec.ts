import { BadRequestException } from '@nestjs/common';
import { Types, type ClientSession, type Model } from 'mongoose';
import { HistorialService } from './historial.service';
import { HistorialRepository } from './repository/historial-respository';
import type { CreateHistorialInput } from 'netim2-shared';
import type { HistorialDocument } from './schema/historial.schema';
import { POCION_LIST } from '../item/const/miscs/pocion/pocion-list.const';
import { FighterCombatFactory } from '../fight/factories/fighter-combat-entity.factory';
import { GENERAL_CHARACTER } from '../character/const/general-character.const';

describe('Historial', () => {
    const session = { inTransaction: () => true } as ClientSession;
    const fighter = new FighterCombatFactory().createSidesWithMobs([{ ...structuredClone(GENERAL_CHARACTER), id: 'character' }], []).allies[0];
    const input: CreateHistorialInput = {
        fightId: 'fight-1', filtro: 'pvm', fecha: 1000,
        enemies: [],
        result: { outcome: 'draw', survivingFighterIds: ['character'], defeatedFighterIds: [],
            reason: 'max_turns_reached', finishedOnTurn: 10 },
        fight: [{ fighterId: 'character', name: 'Character', side: 'allies', alive: true,
            resources: { hp: 100, mana: 50 }, statistics: fighter.statistics.toSnapshot() }],
        rewards: { expGranted: 100, yangGranted: 20, pendingItems: [POCION_LIST[0], POCION_LIST[0]] },
    };

    it('prepara el resumen con drops independientes y no conserva referencias de entrada', () => {
        const service = new HistorialService({} as HistorialRepository);
        const result = service.createHistorialDetalle(input);
        expect(result.fight).toEqual(input.fight);
        expect(result.rewards.pendingItems).toHaveLength(2);
        expect(new Set(result.rewards.pendingItems.map(reward => reward.rewardId)).size).toBe(2);
        result.fight[0].resources.hp = 0;
        result.rewards.pendingItems[0].item.name = 'changed';
        expect(input.fight[0].resources.hp).toBe(100);
        expect(input.rewards.pendingItems[0].name).not.toBe('changed');
    });

    it('prepara una selección de pendientes y rechaza IDs repetidos', async () => {
        const repository = { getHistorialById: jest.fn() };
        const service = new HistorialService(repository as unknown as HistorialRepository);
        const detalles = service.createHistorialDetalle(input);
        const _id = new Types.ObjectId();
        repository.getHistorialById.mockResolvedValue({ _id, characterOwner: 'owner', detalles });
        const rewardId = detalles.rewards.pendingItems[0].rewardId;
        const request = { historialId: _id.toString(), rewardIds: [rewardId] };
        expect((await service.prepareRewards(request, 'owner', session)).rewards).toEqual([detalles.rewards.pendingItems[0]]);
        await expect(service.prepareRewards({ ...request, rewardIds: [rewardId, rewardId] }, 'owner', session))
            .rejects.toThrow(BadRequestException);
        await expect(service.prepareRewards({ ...request, rewardIds: ['already-claimed'] }, 'owner', session))
            .rejects.toThrow('Una recompensa ya fue reclamada');
    });

    it('limita por propietario y categoría y elimina los más antiguos sin filtrar recompensas pendientes', async () => {
        const ids = [new Types.ObjectId(), new Types.ObjectId()];
        const query = {
            sort: jest.fn().mockReturnThis(), skip: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(), session: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(ids.map(_id => ({ _id }))),
        };
        const model = { find: jest.fn(() => query), deleteMany: jest.fn() };
        const repository = new HistorialRepository(model as unknown as Model<HistorialDocument>);
        await repository.pruneHistorials('owner', 'pvm', session);
        expect(model.find).toHaveBeenCalledWith({
            characterOwner: 'owner', 'detalles.filtro': 'pvm',
        });
        expect(query.sort).toHaveBeenCalledWith({ 'detalles.fecha': -1, _id: -1 });
        expect(query.skip).toHaveBeenCalledWith(10);
        expect(model.deleteMany).toHaveBeenCalledWith({
            _id: { $in: ids }, characterOwner: 'owner', 'detalles.filtro': 'pvm',
        }, { session });
    });

    it('confirma pendientes con una condición atómica sobre todos los IDs y la propiedad', async () => {
        const detalles = new HistorialService({} as HistorialRepository).createHistorialDetalle({ ...input,
            rewards: { ...input.rewards, pendingItems: [] } });
        const query = { lean: jest.fn().mockResolvedValue({ detalles }) };
        const model = { findOneAndUpdate: jest.fn(() => query) };
        const repository = new HistorialRepository(model as unknown as Model<HistorialDocument>);
        jest.spyOn(repository, 'pruneHistorials').mockResolvedValue();
        await repository.confirmRewards('history', 'owner', ['reward'], session);
        expect(model.findOneAndUpdate).toHaveBeenCalledWith({
            _id: 'history', characterOwner: 'owner', 'detalles.rewards.pendingItems.rewardId': { $all: ['reward'] },
        }, { $pull: { 'detalles.rewards.pendingItems': { rewardId: { $in: ['reward'] } } } }, { new: true, session });
    });

    it('rechaza un guardado fuera de la transacción de liquidación', async () => {
        const repository = new HistorialRepository({} as Model<HistorialDocument>);
        const details = new HistorialService(repository).createHistorialDetalle(input);
        await expect(repository.saveHistorial(details, 'owner', { inTransaction: () => false } as ClientSession))
            .rejects.toThrow('transacción activa');
    });
});
