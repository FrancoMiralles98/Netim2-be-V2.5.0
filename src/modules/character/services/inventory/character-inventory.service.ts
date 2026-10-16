import { BadRequestException, Injectable } from '@nestjs/common';
import { CharacterPersistence, InventoryItem, Position } from 'netim2-shared';
import { CharacterMapper } from '../../mapper/character-mapper';

export type CharacterInventoryMoveResult = {
    character: CharacterPersistence;
    movedItem: InventoryItem;
};

@Injectable()
export class CharacterInventoryService {
    constructor(private readonly characterMapper: CharacterMapper) {}

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
