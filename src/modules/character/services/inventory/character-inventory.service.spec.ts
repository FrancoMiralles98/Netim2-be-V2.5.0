import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Connection } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { InventoryItem } from 'netim2-shared';
import { GENERAL_CHARACTER } from '../../const/general-character.const';
import { MoveInventoryItemDto } from '../../dto/move-inventory-item.dto';
import { CharacterMapper } from '../../mapper/character-mapper';
import { CharacterRepository } from '../../repository/character-repository';
import { CharacterInventoryService } from './character-inventory.service';
import { CharacterInventoryOrchestratorService } from './character-inventory-orchestrator.service';

describe('Character inventory movement', () => {
    const mapper = new CharacterMapper();
    const actions = new CharacterInventoryService(mapper);
    function character() {
        const source = structuredClone(GENERAL_CHARACTER);
        source.inventario = [
            { id: 'moving', type: 'equip', size: { rows: 2, cols: 1 }, position: { row: 0, col: 0 } },
            { id: 'other', type: 'equip', size: { rows: 1, cols: 1 }, position: { row: 0, col: 2 } },
        ] as InventoryItem[];
        return source;
    }

    it.each([{ row: 1, col: 0 }, { row: 0, col: 0 }, { row: 4, col: 18 }])('moves to %o including its own occupied cells without mutating input', position => {
        const source = character();
        const before = structuredClone(source);
        const result = actions.moveItem(source, 'moving', position);
        expect(result.character.inventario[0].position).toEqual(position);
        expect(result.movedItem).toEqual(result.character.inventario[0]);
        expect(result.character.inventario[1]).toEqual(source.inventario[1]);
        expect(source).toEqual(before);
        result.movedItem.position.row = 99;
        expect(result.character.inventario[0].position).toEqual(position);
    });

    it.each([{ row: 0, col: 2 }, { row: 5, col: 0 }, { row: 0, col: 19 }, { row: -1, col: 0 }, { row: 0.5, col: 0 }])('rejects blocked or invalid position %o', position => {
        const source = character();
        const before = structuredClone(source);
        expect(() => actions.moveItem(source, 'moving', position)).toThrow(BadRequestException);
        expect(source).toEqual(before);
    });

    it('rejects a missing item', () => {
        expect(() => actions.moveItem(character(), 'missing', { row: 3, col: 0 })).toThrow(BadRequestException);
    });

    it('loads once, verifies ownership, persists the new inventory, then returns only ID and position', async () => {
        const source = character();
        const repository = {
            getCharacterById: jest.fn().mockResolvedValue({ ...source, user_owner: 'owner' }),
            updateCharacterById: jest.fn().mockResolvedValue(undefined),
        };
        const service = new CharacterInventoryOrchestratorService(repository as unknown as CharacterRepository, mapper, actions, {} as Connection);
        expect(await service.moveItem('character', 'owner', 'moving', { row: 2, col: 3 })).toEqual({ id: 'moving', position: { row: 2, col: 3 } });
        expect(repository.getCharacterById).toHaveBeenCalledTimes(1);
        expect(repository.updateCharacterById).toHaveBeenCalledWith('character', { inventario: [
            { ...source.inventario[0], position: { row: 2, col: 3 } }, source.inventario[1],
        ] });
        repository.getCharacterById.mockClear();
        repository.updateCharacterById.mockClear();
        await expect(service.moveItem('character', 'other-account', 'moving', { row: 2, col: 3 })).rejects.toBeInstanceOf(ForbiddenException);
        expect(repository.updateCharacterById).not.toHaveBeenCalled();
        await expect(service.moveItem('character', 'owner', 'moving', { row: 0, col: 2 })).rejects.toBeInstanceOf(BadRequestException);
        expect(repository.updateCharacterById).not.toHaveBeenCalled();
        repository.updateCharacterById.mockRejectedValue(new Error('write failed'));
        await expect(service.moveItem('character', 'owner', 'moving', { row: 2, col: 3 })).rejects.toThrow('write failed');
    });

    it.each([
        { itemId: '', position: { row: 0, col: 0 } },
        { itemId: 'moving' },
        { itemId: 'moving', position: { row: -1, col: 0 } },
        { itemId: 'moving', position: { row: 0.5, col: 0 } },
        { itemId: 'moving', position: { row: 0 } },
    ])('validates invalid request %o', async body => {
        expect((await validate(plainToInstance(MoveInventoryItemDto, body))).length).toBeGreaterThan(0);
    });
});
