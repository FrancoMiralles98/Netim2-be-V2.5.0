import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { CharacterMapper } from '../../mapper/character-mapper';
import { CharacterRepository } from '../../repository/character-repository';
import type { IncreaseCharacterAttributeRequest, IncreaseCharacterAttributeResponse } from 'netim2-shared';
import { CharacterAttributeService } from './character-attribute.service';
import { MissionProgressService } from '../../../misiones/services/mission-progress.service';

@Injectable()
export class CharacterAttributeOrchestratorService {
    constructor(
        private readonly characterRepository: CharacterRepository,
        private readonly characterMapper: CharacterMapper,
        private readonly characterAttributeService: CharacterAttributeService,
        @InjectConnection() private readonly connection: Connection,
        private readonly missions: MissionProgressService,
    ) {}

    async increaseAttribute(characterId: string, accountId: string, request: IncreaseCharacterAttributeRequest): Promise<IncreaseCharacterAttributeResponse> {
        const session = await this.connection.startSession();
        try {
            return await session.withTransaction(async () => {
                const document = await this.characterRepository.getCharacterById(characterId, session);
                if (document.user_owner !== accountId) throw new ForbiddenException('El personaje no pertenece a la cuenta');
                const { character, response } = this.characterAttributeService.increaseAttribute(this.characterMapper.fromDb(document), request);
                const missionOption = this.missions.register(character, [{ type: 'action',
                    action: { event: 'attribute_point_allocated', attribute: request.attribute },
                }]);
                await this.characterRepository.updateCharacterById(characterId, {
                    stats: character.stats,
                    atributos: character.atributos,
                    puntos_atributos: character.puntos_atributos,
                    ...(missionOption ? { mission_option: missionOption } : {}),
                }, session);
                return response;
            });
        } finally {
            await session.endSession();
        }
    }
}
