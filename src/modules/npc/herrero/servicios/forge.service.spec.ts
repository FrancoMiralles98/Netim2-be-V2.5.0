import type { ForgeAttemptModifierConfig, IdItemList } from 'netim2-shared';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IdItem } from 'netim2-shared';
import { ItemModule } from '../../../item/item.module';
import { ItemService } from '../../../item/item.service';
import { InventoryItemFactory } from '../../../inventory/factories/inventory-item.factory';
import { GENERAL_CHARACTER } from '../../../character/const/general-character.const';
import { CharacterRepository } from '../../../character/repository/character-repository';
import { CharacterMapper } from '../../../character/mapper/character-mapper';
import { withEquipmentForge } from '../../../item/utils/equipment-forge';
import { FORGE_MATERIAL_REQUIREMENTS } from '../const/forge-material-requirements.const';
import { FORGE_ATTEMPT_MODIFIERS_CONFIG } from '../config/forge-attempt-modifiers.config';
import { ForgeActionsService } from './forge-actions.service';
import { ForgeCalculationService } from './forge-calculation.service';
import { ForgeOrchestratorService } from './forge-orchestrator.service';
import type { Connection } from 'mongoose';
import { RngService } from '../../../shared/services/rng.service';

describe('Herrería: durabilidad y consulta de mejora', () => {
    let module: TestingModule;
    let items: ItemService;
    let actions: ForgeActionsService;
    const calculation = new ForgeCalculationService();
    const requirements = FORGE_MATERIAL_REQUIREMENTS.find(group => group.idItems.includes(IdItem.ESPADA))!;
    const initialRequirements = structuredClone(requirements.requirementsByUpgrade);
    const modifiers = FORGE_ATTEMPT_MODIFIERS_CONFIG as Partial<Record<IdItemList, ForgeAttemptModifierConfig>>;
    const initialModifiers = structuredClone(modifiers);

    beforeAll(async () => {
        module = await Test.createTestingModule({ imports: [ItemModule],
            providers: [ForgeActionsService, ForgeCalculationService, RngService] }).compile();
        items = module.get(ItemService);
        actions = module.get(ForgeActionsService);
    });
    beforeEach(() => {
        requirements.requirementsByUpgrade = { 1: [{ idItem: IdItem.GARRA_DE_LOBO, quantity: 2 }], 6: [], 8: [] };
    });
    afterEach(() => {
        requirements.requirementsByUpgrade = structuredClone(initialRequirements);
        for (const key of Object.keys(modifiers)) delete modifiers[Number(key) as IdItemList];
        Object.assign(modifiers, initialModifiers);
    });
    afterAll(async () => { await module.close(); });

    function equipment(upgradeLv: 0 | 5 | 7 | 9 = 0, durability = 3) {
        const base = items.getItems({ items: [{ idItem: IdItem.ESPADA, upgradeLv }] })[0];
        if (base.type !== 'equip') throw new Error('Equipo de prueba ausente');
        return { ...withEquipmentForge(base), id: 'sword', position: { row: 0, col: 0 }, forge: { durability } };
    }

    it('inicializa catálogo y nuevas instancias con 3 sin reiniciar equipo transferido', () => {
        const saved = equipment(0, 0);
        expect(items.getItems({ items: [{ idItem: IdItem.ESPADA }] })[0]).toMatchObject({ forge: { durability: 3 } });
        expect(InventoryItemFactory.create(saved, { row: 1, col: 0 })).toMatchObject({ forge: { durability: 0 } });
        const { forge: _forge, ...legacy } = saved;
        // Simula un documento antiguo, anterior al contrato que exige forge.
        expect(InventoryItemFactory.create(legacy as typeof saved, { row: 1, col: 0 })).toMatchObject({ forge: { durability: 3 } });
        expect(items.getUpdatedInventoryItem(saved)).toMatchObject({ forge: { durability: 0 } });
    });

    it('recalcula implícitos de la siguiente mejora conservando identidad y estado sin mutación', () => {
        const saved = equipment(0, 2);
        const character = { ...structuredClone(GENERAL_CHARACTER), inventario: [saved] };
        const before = structuredClone(character);
        const result = actions.previewUpgrade(character, { itemId: saved.id });
        expect(result.item).toMatchObject({ id: saved.id, upgradeLv: 1, forge: { durability: 2 }, position: saved.position });
        expect(result.item.implicitBonus).not.toEqual(saved.implicitBonus);
        expect(result.item.explicitBonus).toEqual(saved.explicitBonus);
        expect(result.materials[0]).toMatchObject({ item: { idItem: IdItem.GARRA_DE_LOBO }, quantity: 2 });
        expect(character).toEqual(before);
    });

    it.each([0, 1, 2, 3])('distribuye el fallo con durabilidad %i y conserva el total', durability => {
        const chances = calculation.getChances(50, durability);
        expect(chances.durabilityLoss).toBeCloseTo(25 * durability / 3);
        expect(chances.destruction).toBeCloseTo(50 - chances.durabilityLoss);
        expect(Object.values(chances).reduce((sum, value) => sum + value, 0)).toBeCloseTo(100);
        expect(calculation.getChances(50, durability, { quantity: 1, preventDestruction: true }))
            .toEqual({ success: 50, destruction: 0, durabilityLoss: 0, protectedFailure: 50 });
    });

    it('el manual aumenta las chances un 40 % relativo sin proteger contra destrucción o desgaste', () => {
        const consumable = items.getItems({ items: [{ idItem: IdItem.MANUAL_DEL_HERRERO }] })[0];
        const character = { ...structuredClone(GENERAL_CHARACTER), inventario: [equipment(5, 0),
            InventoryItemFactory.create(consumable, { row: 0, col: 2 })] };
        const result = actions.previewUpgrade(character, { itemId: 'sword', modifierItemId: character.inventario[1].id });
        expect(result.chances).toEqual({ success: 70, destruction: 30, durabilityLoss: 0, protectedFailure: 0 });
        expect(result.upgradeLvAfterProtectedFailure).toBe(5);
        expect(calculation.getChances(50, 3, modifiers[IdItem.MANUAL_DEL_HERRERO]))
            .toEqual({ success: 70, destruction: 15, durabilityLoss: 15, protectedFailure: 0 });
    });

    it.each([0, 1, 2, 3])('la bendición conserva durabilidad %i y baja de +7 a +6 al fallar el intento a +8', durability => {
        const consumable = items.getItems({ items: [{ idItem: IdItem.PERGAMINO_BENDICION }] })[0];
        const character = { ...structuredClone(GENERAL_CHARACTER), inventario: [equipment(7, durability),
            InventoryItemFactory.create(consumable, { row: 0, col: 2 })] };
        const before = structuredClone(character);
        const result = actions.previewUpgrade(character, { itemId: 'sword', modifierItemId: character.inventario[1].id });
        expect(result.chances).toEqual({ success: 30, destruction: 0, durabilityLoss: 0, protectedFailure: 70 });
        expect(result.item.upgradeLv).toBe(8);
        expect(result.upgradeLvAfterProtectedFailure).toBe(6);
        expect(result.durability.afterProtectedFailure).toBe(durability);
        expect(character).toEqual(before);
    });

    it('un fallo protegido nunca reduce el upgrade por debajo de +0', () => {
        expect(calculation.getUpgradeLvAfterProtectedFailure(0, modifiers[IdItem.PERGAMINO_BENDICION])).toBe(0);
        expect(calculation.getUpgradeLvAfterProtectedFailure(1, modifiers[IdItem.PERGAMINO_BENDICION])).toBe(0);
        expect(calculation.getChances(90, 3, modifiers[IdItem.MANUAL_DEL_HERRERO]).success).toBe(100);
    });

    it('incrementa el precio con lvReq y destino', () => {
        expect(calculation.getYangCost(20, 1)).toBeGreaterThan(calculation.getYangCost(1, 1));
        expect(calculation.getYangCost(20, 6)).toBeGreaterThan(calculation.getYangCost(20, 5));
        expect(Number.isInteger(calculation.getYangCost(20, 6))).toBe(true);
    });

    it('rechaza instancias ausentes y el tope de mejora', () => {
        const character = { ...structuredClone(GENERAL_CHARACTER), inventario: [equipment(9)] };
        expect(() => actions.previewUpgrade(character, { itemId: 'missing' })).toThrow(NotFoundException);
        expect(() => actions.previewUpgrade(character, { itemId: 'sword' })).toThrow(BadRequestException);
    });

    it('no exige materiales si falta el nivel o el grupo y conserva el coste en yang', () => {
        expect(actions.getUpgradeConfig(IdItem.ESPADA, 2).materials).toEqual([]);
        const groupedIds = new Set(FORGE_MATERIAL_REQUIREMENTS.flatMap(group => [...group.idItems]));
        const ungrouped = items.getItems({ items: [{ idItem: IdItem.DAGA }] })[0];
        expect(groupedIds.has(ungrouped.idItem)).toBe(false);
        expect(actions.getUpgradeConfig(ungrouped.idItem, 1).materials).toEqual([]);
        requirements.requirementsByUpgrade = {};
        const character = { ...structuredClone(GENERAL_CHARACTER), inventario: [equipment()] };
        const result = actions.previewUpgrade(character, { itemId: 'sword' });
        expect(result.materials).toEqual([]);
        expect(result.yangCost).toBeGreaterThan(0);
        expect(result.item.upgradeLv).toBe(1);
    });

    it('valida la propiedad antes de consultar los ítems', async () => {
        const repository = { getCharacterById: jest.fn().mockResolvedValue({ user_owner: 'other' }) };
        const mapper = { fromDb: jest.fn() };
        const forge = new ForgeOrchestratorService(actions, repository as unknown as CharacterRepository, mapper as unknown as CharacterMapper, {} as Connection);
        await expect(forge.previewUpgrade('character', 'owner', { itemId: 'sword' })).rejects.toThrow(ForbiddenException);
        expect(mapper.fromDb).not.toHaveBeenCalled();
    });
});
