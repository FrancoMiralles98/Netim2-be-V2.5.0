import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Connection } from 'mongoose';
import { POCION_LIST } from '../../../item/const/miscs/pocion/pocion-list.const';
import { GENERAL_CHARACTER } from '../../const/general-character.const';
import { CharacterMapper } from '../../mapper/character-mapper';
import { CharacterRepository } from '../../repository/character-repository';
import { CharacterInventoryService } from './character-inventory.service';
import { CharacterInventoryOrchestratorService } from './character-inventory-orchestrator.service';

describe('CharacterInventoryService mergeItems', () => {
    const mapper = new CharacterMapper();
    const actions = new CharacterInventoryService(mapper);
    function character(quantity = 30, destination = 150) {
        const source = structuredClone(GENERAL_CHARACTER);
        source.inventario = [
            { ...structuredClone(POCION_LIST[0]), acc: true, maxCantidad: 200, id: 'source', cantidad: quantity, position: { row: 0, col: 0 } },
            { ...structuredClone(POCION_LIST[0]), acc: true, maxCantidad: 200, id: 'target', cantidad: destination, position: { row: 0, col: 1 } },
        ];
        return source;
    }

    it.each([
        [30, 150, 10, 20, 160],
        [30, 150, 30, 0, 180],
        [30, 180, 30, 10, 200],
        [30, 195, 10, 25, 200],
        [30, 170, 30, 0, 200],
    ])('transfers from %i into %i requesting %i, leaving %i and %i', (quantity, destination, requested, remaining, finalTarget) => {
        const source = character(quantity, destination);
        const before = structuredClone(source);
        const result = actions.mergeItems(source, { itemId: 'source', targetItemId: 'target', quantity: requested });
        expect(result.response).toEqual({ updatedItems: [
            { id: 'source', cantidad: remaining }, { id: 'target', cantidad: finalTarget },
        ] });
        expect(result.character.inventario.find(item => item.id === 'source')).toEqual(
            remaining ? { ...before.inventario[0], cantidad: remaining } : undefined);
        expect(result.character.inventario.find(item => item.id === 'target')).toEqual({ ...before.inventario[1], cantidad: finalTarget });
        expect(remaining + finalTarget).toBe(quantity + destination);
        expect(source).toEqual(before);
    });

    it.each([0, -1, 1.5, 31, NaN, Infinity])('rejects invalid quantity %s before changing anything', quantity => {
        const source = character();
        const before = structuredClone(source);
        expect(() => actions.mergeItems(source, { itemId: 'source', targetItemId: 'target', quantity })).toThrow(BadRequestException);
        expect(source).toEqual(before);
    });

    it('rejects a full target, self-merge, missing items and different catalog IDs', () => {
        expect(() => actions.mergeItems(character(30, 200), { itemId: 'source', targetItemId: 'target', quantity: 1 })).toThrow('completo');
        const source = character();
        expect(() => actions.mergeItems(source, { itemId: 'source', targetItemId: 'source', quantity: 1 })).toThrow('distintos');
        expect(() => actions.mergeItems(source, { itemId: 'missing', targetItemId: 'target', quantity: 1 })).toThrow(BadRequestException);
        expect(() => actions.mergeItems(source, { itemId: 'source', targetItemId: 'missing', quantity: 1 })).toThrow(BadRequestException);
        source.inventario[1].idItem = POCION_LIST[1].idItem;
        expect(() => actions.mergeItems(source, { itemId: 'source', targetItemId: 'target', quantity: 1 })).toThrow('mismo idItem');
    });

    it.each([0, 1])('validates stackability of item %i', index => {
        const source = character();
        source.inventario[index].acc = false;
        expect(() => actions.mergeItems(source, { itemId: 'source', targetItemId: 'target', quantity: 1 })).toThrow('acumulables');
        source.inventario[index].acc = true;
        Object.assign(source.inventario[index], { maxCantidad: 1 });
        expect(() => actions.mergeItems(source, { itemId: 'source', targetItemId: 'target', quantity: 1 })).toThrow('acumulables');
    });

    it('checks ownership and persists both stack changes in the same transaction', async () => {
        const source = character();
        const repository = {
            getCharacterById: jest.fn().mockResolvedValue({ ...source, user_owner: 'owner' }),
            updateCharacterById: jest.fn().mockResolvedValue(undefined),
        };
        const session = { withTransaction: jest.fn(async callback => callback()), endSession: jest.fn() };
        const connection = { startSession: jest.fn().mockResolvedValue(session) };
        const service = new CharacterInventoryOrchestratorService(repository as unknown as CharacterRepository, mapper, actions, connection as unknown as Connection);
        const body = { itemId: 'source', targetItemId: 'target', quantity: 30 };
        expect(await service.mergeItems('character', 'owner', body)).toEqual({ updatedItems: [
            { id: 'source', cantidad: 0 }, { id: 'target', cantidad: 180 },
        ] });
        expect(repository.getCharacterById).toHaveBeenCalledTimes(1);
        expect(repository.updateCharacterById).toHaveBeenCalledWith('character', { inventario: [{ ...source.inventario[1], cantidad: 180 }] }, session);
        repository.updateCharacterById.mockClear();
        await expect(service.mergeItems('character', 'other', body)).rejects.toBeInstanceOf(ForbiddenException);
        expect(repository.updateCharacterById).not.toHaveBeenCalled();
        await expect(service.mergeItems('character', 'owner', { ...body, quantity: 31 })).rejects.toBeInstanceOf(BadRequestException);
        expect(repository.updateCharacterById).not.toHaveBeenCalled();
        repository.updateCharacterById.mockRejectedValue(new Error('write failed'));
        await expect(service.mergeItems('character', 'owner', body)).rejects.toThrow('write failed');
        expect(session.endSession).toHaveBeenCalledTimes(4);
    });
});
