import { ForbiddenException, Injectable } from '@nestjs/common';
import { MoveInventoryItemResponse, Position } from 'netim2-shared';
import { CharacterMapper } from '../../mapper/character-mapper';
import { CharacterRepository } from '../../repository/character-repository';
import { CharacterInventoryService } from './character-inventory.service';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import type { CharacterInventoryActionResult, DiscardInventoryItemRequest, DiscardInventoryItemResponse, SplitInventoryItemRequest, SplitInventoryItemResponse } from 'netim2-shared';
import type { CharacterPersistence } from 'netim2-shared';
import type { MergeInventoryItemsRequest, MergeInventoryItemsResponse } from 'netim2-shared';

@Injectable()
export class CharacterInventoryOrchestratorService {
    constructor(
        private readonly characterRepository: CharacterRepository,
        private readonly characterMapper: CharacterMapper,
        private readonly characterInventoryService: CharacterInventoryService,
        @InjectConnection() private readonly connection: Connection,
    ) {}

    mergeItems(characterId: string, accountId: string, request: MergeInventoryItemsRequest): Promise<MergeInventoryItemsResponse> {
        return this.executeInventoryAction(characterId, accountId, character => this.characterInventoryService.mergeItems(character, request));
    }

    splitItem(characterId: string, accountId: string, request: SplitInventoryItemRequest): Promise<SplitInventoryItemResponse> {
        return this.executeInventoryAction(characterId, accountId, character => this.characterInventoryService.splitItem(character, request));
    }

    discardItem(characterId: string, accountId: string, request: DiscardInventoryItemRequest): Promise<DiscardInventoryItemResponse> {
        return this.executeInventoryAction(characterId, accountId, character => this.characterInventoryService.discardItem(character, request));
    }

    private async executeInventoryAction<T>(characterId: string, accountId: string,
        action: (character: CharacterPersistence) => CharacterInventoryActionResult<T>): Promise<T> {
        const session = await this.connection.startSession();
        try {
            return await session.withTransaction(async () => {
                const document = await this.characterRepository.getCharacterById(characterId, session);
                if (document.user_owner !== accountId) throw new ForbiddenException('El personaje no pertenece a la cuenta');
                const { character, response } = action(this.characterMapper.fromDb(document));
                await this.characterRepository.updateCharacterById(characterId, { inventario: character.inventario }, session);
                return response;
            });
        } finally {
            await session.endSession();
        }
    }

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
