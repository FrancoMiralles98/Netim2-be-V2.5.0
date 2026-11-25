import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { CharacterModel } from '../../character/schema/character.schema';
import { HistorialService } from '../historial.service';
import { HistorialQueryService } from './historial-query.service';

describe('HistorialQueryService', () => {
    const lean = jest.fn();
    const characters = { findById: jest.fn(() => ({ select: jest.fn(() => ({ lean })) })) };
    const histories = { getPartialsHistoriales: jest.fn(), getHistorialById: jest.fn() };
    const service = new HistorialQueryService(
        characters as unknown as Model<CharacterModel>, histories as unknown as HistorialService,
    );

    beforeEach(() => { jest.clearAllMocks(); });

    it('autoriza ambas consultas y conserva el alcance del personaje', async () => {
        lean.mockResolvedValue({ user_owner: 'account' });
        histories.getPartialsHistoriales.mockResolvedValue([]);
        histories.getHistorialById.mockResolvedValue({ id: 'history' });
        await expect(service.getPartialsHistoriales('character', 'account', 'pvp')).resolves.toEqual([]);
        await expect(service.getHistorialById('history', 'character', 'account')).resolves.toEqual({ id: 'history' });
        expect(histories.getPartialsHistoriales).toHaveBeenCalledWith('character', 'pvp');
        expect(histories.getHistorialById).toHaveBeenCalledWith('history', 'character');
    });

    it.each([null, { user_owner: 'another-account' }])('impide consultar historiales sin propiedad: %j', async character => {
        lean.mockResolvedValue(character);
        const error = character ? ForbiddenException : NotFoundException;
        await expect(service.getPartialsHistoriales('character', 'account')).rejects.toBeInstanceOf(error);
        await expect(service.getHistorialById('history', 'character', 'account')).rejects.toBeInstanceOf(error);
        expect(histories.getPartialsHistoriales).not.toHaveBeenCalled();
        expect(histories.getHistorialById).not.toHaveBeenCalled();
    });
});
