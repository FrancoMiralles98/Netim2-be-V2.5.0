import { BadRequestException, Injectable } from '@nestjs/common';
import { CharacterPersistence, InventoryItem, Position } from 'netim2-shared';
import { CharacterMapper } from '../../mapper/character-mapper';
import type { CharacterInventoryActionResult, DiscardInventoryItemRequest, DiscardInventoryItemResponse, SplitInventoryItemRequest, SplitInventoryItemResponse } from 'netim2-shared';
import type { MergeInventoryItemsRequest, MergeInventoryItemsResponse } from 'netim2-shared';

export type CharacterInventoryMoveResult = {
    character: CharacterPersistence;
    movedItem: InventoryItem;
};

@Injectable()
export class CharacterInventoryService {
    constructor(private readonly characterMapper: CharacterMapper) {}

    mergeItems(character: CharacterPersistence, request: MergeInventoryItemsRequest): CharacterInventoryActionResult<MergeInventoryItemsResponse> {
        const entity = this.characterMapper.toDomain(structuredClone(character));
        try {
            const updatedItems = entity.mergeItemsFromInventory(request.itemId, request.targetItemId, request.quantity);
            return { character: this.characterMapper.toPersistence(entity), response: { updatedItems } };
        } catch (error) {
            throw new BadRequestException(error instanceof Error ? error.message : 'No se pueden agrupar los items');
        }
    }

    splitItem(character: CharacterPersistence, request: SplitInventoryItemRequest): CharacterInventoryActionResult<SplitInventoryItemResponse> {
        const entity = this.characterMapper.toDomain(structuredClone(character));
        try {
            const response = entity.splitItemFromInventory(request.itemId, request.quantity);
            return { character: this.characterMapper.toPersistence(entity), response };
        } catch (error) {
            throw new BadRequestException(error instanceof Error ? error.message : 'No se puede dividir el item');
        }
    }

    discardItem(character: CharacterPersistence, request: DiscardInventoryItemRequest): CharacterInventoryActionResult<DiscardInventoryItemResponse> {
        const entity = this.characterMapper.toDomain(structuredClone(character));
        try {
            const removedItem = entity.removeItemFromInventory(request.itemId);
            return { character: this.characterMapper.toPersistence(entity), response: { id: removedItem.id } };
        } catch (error) {
            throw new BadRequestException(error instanceof Error ? error.message : 'No se puede eliminar el item');
        }
    }

    moveItem(character: CharacterPersistence, itemId: string, position: Position): CharacterInventoryMoveResult {
        const entity = this.characterMapper.toDomain(structuredClone(character));
        let movedItem: InventoryItem;
        try {
            movedItem = entity.moveItemFromInventory(itemId, structuredClone(position));
        } catch (error) {
            throw new BadRequestException(error instanceof Error ? error.message : 'No se puede mover el item');
        }
        return { character: this.characterMapper.toPersistence(entity), movedItem: structuredClone(movedItem) };
    }
}
