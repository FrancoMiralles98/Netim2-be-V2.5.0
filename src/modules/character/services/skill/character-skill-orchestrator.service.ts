import { ForbiddenException, Injectable } from '@nestjs/common';
import { CharacterRepository } from '../../repository/character-repository';
import { CharacterMapper } from '../../mapper/character-mapper';
import type { GetCharacterSpecialitySkillsRequest, GetCharacterSpecialitySkillsResponse } from 'netim2-shared';
import { CharacterSkillService } from './character-skill.service';

@Injectable()
export class CharacterSkillOrchestratorService {
    constructor(
        private readonly characterRepository: CharacterRepository,
        private readonly characterMapper: CharacterMapper,
        private readonly characterSkillService: CharacterSkillService,
    ) {}

    async getSpecialitySkills(characterId: string, accountId: string, request: GetCharacterSpecialitySkillsRequest): Promise<GetCharacterSpecialitySkillsResponse> {
        const document = await this.characterRepository.getCharacterById(characterId);
        if (document.user_owner !== accountId) throw new ForbiddenException('El personaje no pertenece a la cuenta');
        return this.characterSkillService.getSpecialitySkills(this.characterMapper.fromDb(document), request);
    }
}
