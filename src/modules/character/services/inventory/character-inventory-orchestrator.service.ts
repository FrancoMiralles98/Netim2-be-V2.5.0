import { ForbiddenException, Injectable } from '@nestjs/common';
import { MoveInventoryItemResponse, Position } from 'netim2-shared';
import { CharacterMapper } from '../../mapper/character-mapper';
import { CharacterRepository } from '../../repository/character-repository';
import { CharacterInventoryService } from './character-inventory.service';

@Injectable()
export class CharacterInventoryOrchestratorService {
    constructor(
        private readonly characterRepository: CharacterRepository,
        private readonly characterMapper: CharacterMapper,
        private readonly characterInventoryService: CharacterInventoryService,
    ) {}

    async moveItem(characterId: string, accountId: string, itemId: string, position: Position): Promise<MoveInventoryItemResponse> {
        const document = await this.characterRepository.getCharacterById(characterId);
        if (document.user_owner !== accountId) {
            throw new ForbiddenException('El personaje no pertenece a la cuenta');
        }
        const source = this.characterMapper.fromDb(document);
        const { character, movedItem } = this.characterInventoryService.moveItem(source, itemId, position);
        await this.characterRepository.updateCharacterById(characterId, { inventario: character.inventario });
        return { id: movedItem.id, position: movedItem.position };
    }
}
