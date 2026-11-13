import { MissionProgressService } from '../../../misiones/services/mission-progress.service';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Connection } from 'mongoose';
import { GENERAL_CHARACTER } from '../../const/general-character.const';
import { CharacterMapper } from '../../mapper/character-mapper';
import { CharacterRepository } from '../../repository/character-repository';
import { CharacterSkillService } from './character-skill.service';
import { CharacterSkillOrchestratorService } from './character-skill-orchestrator.service';

describe('CharacterSkillOrchestratorService speciality selection', () => {
    let repository: { getCharacterById: jest.Mock; updateCharacterById: jest.Mock };
    let actions: { selectSpeciality: jest.Mock };
    let session: { withTransaction: jest.Mock; endSession: jest.Mock };
    let service: CharacterSkillOrchestratorService;
    let selected: typeof GENERAL_CHARACTER;

    beforeEach(() => {
        const source = structuredClone(GENERAL_CHARACTER);
        source.especialidad = undefined;
        selected = { ...structuredClone(source), especialidad: 'Corporal' };
        repository = {
            getCharacterById: jest.fn().mockResolvedValue({ ...source, user_owner: 'owner' }),
            updateCharacterById: jest.fn().mockResolvedValue(selected),
        };
        actions = { selectSpeciality: jest.fn().mockReturnValue({ character: selected,
            response: { speciality: 'Corporal', skills: selected.hab, stats: selected.stats, attributes: selected.atributos } }) };
        session = { withTransaction: jest.fn(async callback => callback()), endSession: jest.fn().mockResolvedValue(undefined) };
        service = new CharacterSkillOrchestratorService(repository as unknown as CharacterRepository, new CharacterMapper(),
            actions as unknown as CharacterSkillService, { startSession: jest.fn().mockResolvedValue(session) } as unknown as Connection, new MissionProgressService());
    });

    it('loads once and persists only the selected speciality, skills and recalculated stats in one transaction', async () => {
        const response = await service.selectSpeciality('character', 'owner', { speciality: 'Corporal' });
        expect(repository.getCharacterById).toHaveBeenCalledTimes(1);
        expect(repository.getCharacterById).toHaveBeenCalledWith('character', session);
        expect(actions.selectSpeciality).toHaveBeenCalledWith(expect.objectContaining({ especialidad: undefined }), { speciality: 'Corporal' });
        expect(repository.updateCharacterById).toHaveBeenCalledWith('character', {
            especialidad: 'Corporal', hab: selected.hab, stats: selected.stats, atributos: selected.atributos,
        }, session);
        expect(response).toEqual({ speciality: 'Corporal', skills: selected.hab, stats: selected.stats, attributes: selected.atributos });
        expect(session.endSession).toHaveBeenCalledTimes(1);
    });

    it('rejects another account before calculating or saving', async () => {
        await expect(service.selectSpeciality('character', 'other', { speciality: 'Corporal' })).rejects.toBeInstanceOf(ForbiddenException);
        expect(actions.selectSpeciality).not.toHaveBeenCalled();
        expect(repository.updateCharacterById).not.toHaveBeenCalled();
        expect(session.endSession).toHaveBeenCalledTimes(1);
    });

    it('closes the session and propagates a missing character', async () => {
        repository.getCharacterById.mockRejectedValue(new NotFoundException());
        await expect(service.selectSpeciality('missing', 'owner', { speciality: 'Corporal' })).rejects.toBeInstanceOf(NotFoundException);
        expect(repository.updateCharacterById).not.toHaveBeenCalled();
        expect(session.endSession).toHaveBeenCalledTimes(1);
    });

    it('does not save rejected selections and never returns success when saving fails', async () => {
        actions.selectSpeciality.mockImplementationOnce(() => { throw new BadRequestException('Ya elegida'); });
        await expect(service.selectSpeciality('character', 'owner', { speciality: 'Corporal' })).rejects.toThrow('Ya elegida');
        expect(repository.updateCharacterById).not.toHaveBeenCalled();
        repository.updateCharacterById.mockRejectedValue(new Error('write failed'));
        await expect(service.selectSpeciality('character', 'owner', { speciality: 'Corporal' })).rejects.toThrow('write failed');
        expect(session.endSession).toHaveBeenCalledTimes(2);
    });
});
