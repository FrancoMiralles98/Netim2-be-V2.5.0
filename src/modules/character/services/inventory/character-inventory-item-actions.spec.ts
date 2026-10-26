import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Connection } from 'mongoose';
import { Inventory } from '../../../inventory/entities/inventory.entity';
import { POCION_LIST } from '../../../item/const/miscs/pocion/pocion-list.const';
import { GENERAL_CHARACTER } from '../../const/general-character.const';
import { CharacterMapper } from '../../mapper/character-mapper';
import { CharacterRepository } from '../../repository/character-repository';
import { CharacterInventoryService } from './character-inventory.service';
import { CharacterInventoryOrchestratorService } from './character-inventory-orchestrator.service';

describe('Character inventory split and discard', () => {
    const mapper = new CharacterMapper();
    const actions = new CharacterInventoryService(mapper);
    function character() {
        const source = structuredClone(GENERAL_CHARACTER);
        source.inventario = [{ ...structuredClone(POCION_LIST[0]), id: 'stack', acc: true,
            cantidad: 25, maxCantidad: 200, position: { row: 0, col: 0 } }];
        return source;
    }

    it('creates a separate stack with a unique ID and free position, preserving all item data', () => {
        const source = character();
        const original = structuredClone(source);
        const result = actions.splitItem(source, { itemId: 'stack', quantity: 10 });
        expect(result.response.updatedItems).toEqual([{ id: 'stack', cantidad: 15 }]);
        expect(result.response.newItems).toHaveLength(1);
        const added = result.response.newItems[0];
        expect(added.id).not.toBe('stack');
        expect(added.id).toMatch(/^[a-f0-9-]{36}$/);
        expect(added.position).toEqual({ row: 0, col: 1 });
        expect(added).toMatchObject({ ...source.inventario[0], id: added.id, cantidad: 10, position: added.position });
        expect(result.character.inventario).toEqual([{ ...source.inventario[0], cantidad: 15 }, added]);
        expect(source).toEqual(original);
        added.position.row = 5;
        expect(result.character.inventario[1].position.row).toBe(0);
    });

    it.each([0, -1, 0.5, 25, 26, NaN, Infinity])('rejects invalid split quantity %s without modifying the source', quantity => {
        const source = character();
        const original = structuredClone(source);
        expect(() => actions.splitItem(source, { itemId: 'stack', quantity })).toThrow(BadRequestException);
        expect(source).toEqual(original);
    });

    it('rejects non-stackable items, maxCantidad 1 and missing items', () => {
        const source = character();
        source.inventario[0].acc = false;
        expect(() => actions.splitItem(source, { itemId: 'stack', quantity: 10 })).toThrow('no admite');
        source.inventario[0].acc = true;
        Object.assign(source.inventario[0], { maxCantidad: 1 });
        expect(() => actions.splitItem(source, { itemId: 'stack', quantity: 1 })).toThrow('no admite');
        expect(() => actions.splitItem(source, { itemId: 'missing', quantity: 1 })).toThrow(BadRequestException);
    });

    it('checks available space before mutating the original stack', () => {
        const source = character();
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 19; col++) {
                if (row || col) source.inventario.push({ ...structuredClone(source.inventario[0]), id: `${row}-${col}`, position: { row, col } });
            }
        }
        const inventory = new Inventory(structuredClone(source.inventario));
        expect(() => inventory.splitItem('stack', 10)).toThrow('espacio');
        expect(inventory.getInventory()).toEqual(source.inventario);
    });

    it('discards the entire selected instance regardless of quantity', () => {
        const source = character();
        expect(actions.discardItem(source, { itemId: 'stack' })).toMatchObject({
            character: { inventario: [] }, response: { id: 'stack' },
        });
        expect(source.inventario).toHaveLength(1);
        Object.assign(source.inventario[0], { type: 'equip' });
        delete (source.inventario[0] as unknown as Record<string, unknown>).cantidad;
        expect(actions.discardItem(source, { itemId: 'stack' }).character.inventario).toEqual([]);
        expect(() => actions.discardItem(source, { itemId: 'missing' })).toThrow(BadRequestException);
    });

    it.each(['splitItem', 'discardItem'] as const)('authorizes and persists %s in one transaction before returning', async method => {
        const source = character();
        let owner = 'owner';
        const repository = {
            getCharacterById: jest.fn(async () => ({ ...structuredClone(source), user_owner: owner })),
            updateCharacterById: jest.fn().mockResolvedValue(undefined),
        };
        const session = { withTransaction: jest.fn(async callback => callback()), endSession: jest.fn() };
        const connection = { startSession: jest.fn().mockResolvedValue(session) };
        const service = new CharacterInventoryOrchestratorService(repository as unknown as CharacterRepository, mapper, actions, connection as unknown as Connection);
        const body = { itemId: 'stack', quantity: 10 };
        const response = await service[method]('character', 'owner', body);
        expect(response).not.toHaveProperty('character');
        expect(repository.getCharacterById).toHaveBeenCalledTimes(1);
        expect(repository.getCharacterById).toHaveBeenCalledWith('character', session);
        const expectedInventory = 'newItems' in response
            ? [{ ...source.inventario[0], cantidad: 15 }, ...response.newItems]
            : [];
        expect(repository.updateCharacterById).toHaveBeenCalledWith('character', { inventario: expectedInventory }, session);
        expect(session.endSession).toHaveBeenCalledTimes(1);
        repository.updateCharacterById.mockClear();
        owner = 'other';
        await expect(service[method]('character', 'owner', body)).rejects.toBeInstanceOf(ForbiddenException);
        expect(repository.updateCharacterById).not.toHaveBeenCalled();
        owner = 'owner';
        await expect(service[method]('character', 'owner', { itemId: 'missing', quantity: 10 })).rejects.toBeInstanceOf(BadRequestException);
        expect(repository.updateCharacterById).not.toHaveBeenCalled();
        repository.updateCharacterById.mockRejectedValue(new Error('write failed'));
        await expect(service[method]('character', 'owner', body)).rejects.toThrow('write failed');
        expect(session.endSession).toHaveBeenCalledTimes(4);
    });
});
