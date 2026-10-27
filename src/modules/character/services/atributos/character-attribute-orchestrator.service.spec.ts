import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Connection } from 'mongoose';
import { GENERAL_CHARACTER } from '../../const/general-character.const';
import { CharacterMapper } from '../../mapper/character-mapper';
import { CharacterRepository } from '../../repository/character-repository';
import { CharacterAttributeService } from './character-attribute.service';
import { CharacterAttributeOrchestratorService } from './character-attribute-orchestrator.service';

describe('CharacterAttributeOrchestratorService', () => {
    const mapper = new CharacterMapper();
    let source: typeof GENERAL_CHARACTER;
    let result: typeof GENERAL_CHARACTER;
    let repository: { getCharacterById: jest.Mock; updateCharacterById: jest.Mock };
    let actions: { increaseAttribute: jest.Mock };
    let session: { withTransaction: jest.Mock; endSession: jest.Mock };
    let service: CharacterAttributeOrchestratorService;
    beforeEach(() => {
        source = structuredClone(GENERAL_CHARACTER);
        source.puntos_atributos = 2;
        result = structuredClone(source);
        result.puntos_atributos = 1;
        result.atributos.STR.lvPoints += 1;
        result.stats.general.ad.min += 2;
        repository = { getCharacterById: jest.fn().mockResolvedValue({ ...source, user_owner: 'owner' }),
            updateCharacterById: jest.fn().mockResolvedValue(undefined) };
        actions = { increaseAttribute: jest.fn().mockReturnValue({ character: result,
            response: { stats: result.stats, attributes: result.atributos, puntos_atributos: 1 } }) };
        session = { withTransaction: jest.fn(async callback => callback()), endSession: jest.fn().mockResolvedValue(undefined) };
        service = new CharacterAttributeOrchestratorService(repository as unknown as CharacterRepository, mapper,
            actions as unknown as CharacterAttributeService, { startSession: jest.fn().mockResolvedValue(session) } as unknown as Connection);
    });

    it('reads once and saves only stats, attributes and available points in the same transaction', async () => {
        const response = await service.increaseAttribute('character', 'owner', { attribute: 'STR' });
        expect(repository.getCharacterById).toHaveBeenCalledTimes(1);
        expect(repository.getCharacterById).toHaveBeenCalledWith('character', session);
        expect(actions.increaseAttribute).toHaveBeenCalledWith(expect.objectContaining({
            puntos_atributos: 2, atributos: source.atributos, stats: source.stats,
        }), { attribute: 'STR' });
        expect(repository.updateCharacterById).toHaveBeenCalledWith('character', {
            stats: result.stats, atributos: result.atributos, puntos_atributos: 1,
        }, session);
        expect(response).toEqual({ stats: result.stats, attributes: result.atributos, puntos_atributos: 1 });
        expect(session.endSession).toHaveBeenCalledTimes(1);
    });

    it('rejects foreign characters before executing or persisting the action', async () => {
        await expect(service.increaseAttribute('character', 'other', { attribute: 'STR' })).rejects.toBeInstanceOf(ForbiddenException);
        expect(actions.increaseAttribute).not.toHaveBeenCalled();
        expect(repository.updateCharacterById).not.toHaveBeenCalled();
        expect(session.endSession).toHaveBeenCalledTimes(1);
    });

    it('does not save invalid actions and does not return success if saving fails', async () => {
        actions.increaseAttribute.mockImplementationOnce(() => { throw new BadRequestException('Sin puntos'); });
        await expect(service.increaseAttribute('character', 'owner', { attribute: 'STR' })).rejects.toThrow('Sin puntos');
        expect(repository.updateCharacterById).not.toHaveBeenCalled();
        repository.updateCharacterById.mockRejectedValue(new Error('write failed'));
        await expect(service.increaseAttribute('character', 'owner', { attribute: 'STR' })).rejects.toThrow('write failed');
        expect(session.endSession).toHaveBeenCalledTimes(2);
    });

    it('propagates missing characters and closes the session', async () => {
        repository.getCharacterById.mockRejectedValue(new NotFoundException());
        await expect(service.increaseAttribute('missing', 'owner', { attribute: 'STR' })).rejects.toBeInstanceOf(NotFoundException);
        expect(actions.increaseAttribute).not.toHaveBeenCalled();
        expect(session.endSession).toHaveBeenCalledTimes(1);
    });
});
