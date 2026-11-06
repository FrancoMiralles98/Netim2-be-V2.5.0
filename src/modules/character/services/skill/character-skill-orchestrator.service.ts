import { ForbiddenException, Injectable } from '@nestjs/common';
import { CharacterRepository } from '../../repository/character-repository';
import { CharacterMapper } from '../../mapper/character-mapper';
import type { GetCharacterSpecialitySkillsRequest, GetCharacterSpecialitySkillsResponse,
    SelectCharacterSpecialityRequest, SelectCharacterSpecialityResponse } from 'netim2-shared';
import { CharacterSkillService } from './character-skill.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import type { GetSkillUpgradePreviewRequest, GetSkillUpgradePreviewResponse } from 'netim2-shared';
import type { UpgradeCharacterSkillRequest, UpgradeCharacterSkillResponse } from '../../types/upgrade-character-skill.types';

@Injectable()
export class CharacterSkillOrchestratorService {
    constructor(
        private readonly characterRepository: CharacterRepository,
        private readonly characterMapper: CharacterMapper,
        private readonly characterSkillService: CharacterSkillService,
        @InjectConnection() private readonly connection: Connection,
    ) {}

    async getUpgradePreview(characterId: string, accountId: string, request: GetSkillUpgradePreviewRequest): Promise<GetSkillUpgradePreviewResponse> {
        const document = await this.characterRepository.getCharacterById(characterId);
        if (document.user_owner !== accountId) throw new ForbiddenException('El personaje no pertenece a la cuenta');
        return this.characterSkillService.getUpgradePreview(this.characterMapper.fromDb(document), request);
    }

    async upgradeSkill(characterId: string, accountId: string, request: UpgradeCharacterSkillRequest): Promise<UpgradeCharacterSkillResponse> {
        const session = await this.connection.startSession();
        try {
            return await session.withTransaction(async () => {
                const document = await this.characterRepository.getCharacterById(characterId, session);
                if (document.user_owner !== accountId) throw new ForbiddenException('El personaje no pertenece a la cuenta');
                const { character, response } = this.characterSkillService.upgradeSkill(this.characterMapper.fromDb(document), request);
                await this.characterRepository.updateCharacterById(characterId, {
                    hab: character.hab,
                    inventario: character.inventario,
                    puntos_habilidad: character.puntos_habilidad,
                }, session);
                return response;
            });
        } finally {
            await session.endSession();
        }
    }

    async getSpecialitySkills(characterId: string, accountId: string, request: GetCharacterSpecialitySkillsRequest): Promise<GetCharacterSpecialitySkillsResponse> {
        const document = await this.characterRepository.getCharacterById(characterId);
        if (document.user_owner !== accountId) throw new ForbiddenException('El personaje no pertenece a la cuenta');
        return this.characterSkillService.getSpecialitySkills(this.characterMapper.fromDb(document), request);
    }

    /** Valida propiedad y guarda especialidad, habilidades y stats juntas; la transacción evita elecciones concurrentes. */
    async selectSpeciality(characterId: string, accountId: string, request: SelectCharacterSpecialityRequest): Promise<SelectCharacterSpecialityResponse> {
        const session = await this.connection.startSession();
        try {
            return await session.withTransaction(async () => {
                const document = await this.characterRepository.getCharacterById(characterId, session);
                if (document.user_owner !== accountId) throw new ForbiddenException('El personaje no pertenece a la cuenta');
                const { character, response } = this.characterSkillService.selectSpeciality(this.characterMapper.fromDb(document), request);
                await this.characterRepository.updateCharacterById(characterId, {
                    especialidad: character.especialidad,
                    hab: character.hab,
                    stats: character.stats,
                    atributos: character.atributos,
                }, session);
                return response;
            });
        } finally {
            await session.endSession();
        }
    }
}
