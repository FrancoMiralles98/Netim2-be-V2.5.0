import { BadRequestException, ForbiddenException, INestApplication, ValidationPipe } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { IdItem } from 'netim2-shared';
import type { CharacterPersistence, ForgeAttemptModifierConfig, ForgeUpgradeLv, IdItemList } from 'netim2-shared';
import { ItemModule } from '../../../item/item.module';
import { ItemService } from '../../../item/item.service';
import { InventoryItemFactory } from '../../../inventory/factories/inventory-item.factory';
import { GENERAL_CHARACTER } from '../../../character/const/general-character.const';
import { CharacterRepository } from '../../../character/repository/character-repository';
import { CharacterMapper } from '../../../character/mapper/character-mapper';
import { AccessTokenGuard } from '../../../auth/guards/access-token.guard';
import { RngService } from '../../../shared/services/rng.service';
import { FORGE_MATERIAL_REQUIREMENTS } from '../const/forge-material-requirements.const';
import { FORGE_ATTEMPT_MODIFIERS_CONFIG } from '../config/forge-attempt-modifiers.config';
import { ForgeController } from '../controller/forge.controller';
import { ForgeActionsService } from './forge-actions.service';
import { ForgeCalculationService } from './forge-calculation.service';
import { ForgeOrchestratorService } from './forge-orchestrator.service';

describe('Ejecución de mejoras del herrero', () => {
    let module: TestingModule;
    let app: INestApplication;
    let items: ItemService;
    let actions: ForgeActionsService;
    let forge: ForgeOrchestratorService;
    let roll: jest.SpyInstance;
    const group = FORGE_MATERIAL_REQUIREMENTS.find(entry => entry.idItems.includes(IdItem.ESPADA))!;
    const originalRequirements = structuredClone(group.requirementsByUpgrade);
    const modifiers = FORGE_ATTEMPT_MODIFIERS_CONFIG as Partial<Record<IdItemList, ForgeAttemptModifierConfig>>;
    const originalModifiers = structuredClone(modifiers);
    const repository = { getCharacterById: jest.fn(), updateCharacterById: jest.fn() };
    const session = { withTransaction: jest.fn(async callback => callback()), endSession: jest.fn() };
    const connection = { startSession: jest.fn(async () => session) };
    const rng = { randomNumberInRange: jest.fn() };
    const characterId = '507f1f77bcf86cd799439011';

    beforeAll(async () => {
        module = await Test.createTestingModule({ imports: [ItemModule], controllers: [ForgeController],
            providers: [ForgeActionsService, ForgeCalculationService, ForgeOrchestratorService, RngService,
                { provide: CharacterRepository, useValue: repository },
                { provide: CharacterMapper, useValue: { fromDb: document => document } },
                { provide: getConnectionToken(), useValue: connection }],
        }).overrideProvider(RngService).useValue(rng).overrideGuard(AccessTokenGuard).useValue({ canActivate: context => {
            context.switchToHttp().getRequest().user = { accountId: 'owner' };
            return true;
        } }).compile();
        items = module.get(ItemService);
        actions = module.get(ForgeActionsService);
        forge = module.get(ForgeOrchestratorService);
        roll = rng.randomNumberInRange;
        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();
    });
    beforeEach(() => {
        jest.clearAllMocks();
        roll.mockReset().mockReturnValue(0);
        group.requirementsByUpgrade = { 6: [{ idItem: IdItem.GARRA_DE_LOBO, quantity: 2 }],
            8: [{ idItem: IdItem.GARRA_DE_LOBO, quantity: 2 }], 9: [] };
        repository.updateCharacterById.mockResolvedValue({});
    });
    afterEach(() => {
        group.requirementsByUpgrade = structuredClone(originalRequirements);
        for (const key of Object.keys(modifiers)) delete modifiers[Number(key) as IdItemList];
        Object.assign(modifiers, structuredClone(originalModifiers));
    });
    afterAll(async () => { await app.close(); });

    function utility(idItem: IdItemList, cantidad: number, id: string) {
        const [base] = items.getItems({ items: [{ idItem }] });
        if (base.type !== 'utility') throw new Error('Consumible de prueba inválido');
        return { ...InventoryItemFactory.create(base, { row: 0, col: 3 }), id, cantidad };
    }

    function character(upgradeLv: ForgeUpgradeLv = 5, durability = 3): CharacterPersistence {
        const [base] = items.getItems({ items: [{ idItem: IdItem.ESPADA, upgradeLv }] });
        if (base.type !== 'equip') throw new Error('Equipo de prueba inválido');
        return { ...structuredClone(GENERAL_CHARACTER), yang: 1_000_000, inventario: [
            { ...base, id: 'sword', position: { row: 0, col: 0 }, forge: { durability } },
            utility(IdItem.GARRA_DE_LOBO, 5, 'material'),
            utility(IdItem.MANUAL_DEL_HERRERO, 2, 'manual'),
            utility(IdItem.PERGAMINO_BENDICION, 2, 'blessing'),
        ] };
    }

    it('mejora, recalcula stats, consume materiales y devuelve la próxima mejora sin mutar la entrada', () => {
        const input = character();
        const before = structuredClone(input);
        const price = actions.previewUpgrade(input, { itemId: 'sword' }).yangCost;
        const { response, changes } = actions.upgradeItem(input, { itemId: 'sword' });
        expect(response.outcome).toBe('success');
        expect(response.item).toMatchObject({ id: 'sword', upgradeLv: 6, forge: { durability: 3 } });
        expect(response.item?.implicitBonus).not.toEqual(input.inventario[0].type === 'equip' ? input.inventario[0].implicitBonus : []);
        expect(response.yang).toBe(input.yang - price);
        expect(response.updatedItems).toEqual([{ id: 'material', cantidad: 3 }]);
        expect(response.nextPreview?.targetUpgradeLv).toBe(7);
        expect(changes.inventario.find(item => item.id === 'sword')).toEqual(response.item);
        expect(input).toEqual(before);
        expect(roll).toHaveBeenCalledTimes(1);
    });

    it('aplica los multiplicadores también en la vista previa y consume el bonificador', () => {
        modifiers[IdItem.MANUAL_DEL_HERRERO]!.resourceMultiplier = { yang: 2, materials: 1.5 };
        const input = character();
        const base = actions.previewUpgrade(input, { itemId: 'sword' });
        const modified = actions.previewUpgrade(input, { itemId: 'sword', modifierItemId: 'manual' });
        expect(modified.yangCost).toBe(base.yangCost * 2);
        expect(modified.materials[0].quantity).toBe(3);
        expect(modified.chances.success).toBe(70);
        const { response } = actions.upgradeItem(input, { itemId: 'sword', modifierIdItem: IdItem.MANUAL_DEL_HERRERO });
        expect(response.yang).toBe(input.yang - modified.yangCost);
        expect(response.updatedItems).toEqual([{ id: 'material', cantidad: 2 }, { id: 'manual', cantidad: 1 }]);
    });

    it('el fallo sin protección hace otra tirada y puede desgastar sin reducir el upgrade', () => {
        roll.mockReturnValueOnce(99).mockReturnValueOnce(0);
        const input = character();
        const result = actions.upgradeItem(input, { itemId: 'sword' }).response;
        expect(result.outcome).toBe('durability_loss');
        expect(result.item).toMatchObject({ upgradeLv: 5, forge: { durability: 2 } });
        expect(result.updatedItems).toEqual([{ id: 'material', cantidad: 3 }]);
        expect(roll).toHaveBeenNthCalledWith(2, 0, 50, true);
    });

    it.each([0, 1, 2, 3])('destruye el equipo con durabilidad %i si la segunda tirada cae en destrucción', durability => {
        roll.mockReturnValueOnce(99).mockReturnValueOnce(49.999);
        const input = character(5, durability);
        const result = actions.upgradeItem(input, { itemId: 'sword' });
        expect(result.response.outcome).toBe('destroyed');
        expect(result.response.item).toBeNull();
        expect(result.response.nextPreview).toBeNull();
        expect(result.response.updatedItems).toEqual([{ id: 'sword' }, { id: 'material', cantidad: 3 }]);
        expect(result.changes.inventario.some(item => item.id === 'sword')).toBe(false);
    });

    it.each([0, 1, 2, 3])('la bendición baja de +7 a +6, recalcula stats y conserva durabilidad %i', durability => {
        roll.mockReturnValue(99);
        const input = character(7, durability);
        const result = actions.upgradeItem(input, { itemId: 'sword', modifierIdItem: IdItem.PERGAMINO_BENDICION }).response;
        expect(result.outcome).toBe('downgraded');
        expect(result.item).toMatchObject({ upgradeLv: 6, forge: { durability } });
        const expected = items.getItems({ items: [{ idItem: IdItem.ESPADA, upgradeLv: 6 }] })[0];
        expect(result.item?.implicitBonus).toEqual(expected.type === 'equip' ? expected.implicitBonus : []);
        expect(result.nextPreview?.targetUpgradeLv).toBe(7);
        expect(result.updatedItems).toContainEqual({ id: 'blessing', cantidad: 1 });
        expect(roll).toHaveBeenCalledTimes(1);
    });

    it('un protector sin penalización conserva nivel y durabilidad', () => {
        modifiers[IdItem.PERGAMINO_BENDICION]!.upgradeLvLossOnProtectedFailure = 0;
        roll.mockReturnValue(99);
        const result = actions.upgradeItem(character(5, 0), { itemId: 'sword', modifierIdItem: IdItem.PERGAMINO_BENDICION }).response;
        expect(result.outcome).toBe('protected_failure');
        expect(result.item).toMatchObject({ upgradeLv: 5, forge: { durability: 0 } });
    });

    it('permite usar la Piedra Mágica del catálogo sin exigir escalados de bonus implícitos', () => {
        const input = character(5, 1);
        input.inventario.push(utility(IdItem.PIEDRA_MAGICA, 1, 'magic-stone'));
        roll.mockReturnValue(99);
        const result = actions.upgradeItem(input, { itemId: 'sword', modifierIdItem: IdItem.PIEDRA_MAGICA }).response;
        expect(result.outcome).toBe('protected_failure');
        expect(result.item).toMatchObject({ upgradeLv: 5, forge: { durability: 1 } });
        expect(result.updatedItems).toContainEqual({ id: 'magic-stone' });
    });

    it('redondea costes fraccionarios hacia arriba y rechaza multiplicadores inválidos antes de tirar', () => {
        modifiers[IdItem.MANUAL_DEL_HERRERO]!.resourceMultiplier = { yang: 0.5, materials: 0.25 };
        const input = character();
        const preview = actions.previewUpgrade(input, { itemId: 'sword', modifierItemId: 'manual' });
        expect(preview.materials[0].quantity).toBe(1);
        modifiers[IdItem.MANUAL_DEL_HERRERO]!.resourceMultiplier!.materials = -1;
        expect(() => actions.upgradeItem(input, { itemId: 'sword', modifierIdItem: IdItem.MANUAL_DEL_HERRERO })).toThrow();
        expect(roll).not.toHaveBeenCalled();
    });

    it('no devuelve próxima mejora al alcanzar +9', () => {
        const result = actions.upgradeItem(character(8), { itemId: 'sword' }).response;
        expect(result.item?.upgradeLv).toBe(9);
        expect(result.nextPreview).toBeNull();
    });

    it('suma materiales y bonificador del mismo idItem, repartiendo el consumo entre stacks', () => {
        group.requirementsByUpgrade[6] = [{ idItem: IdItem.MANUAL_DEL_HERRERO, quantity: 2 }];
        const input = character();
        input.inventario.push(utility(IdItem.MANUAL_DEL_HERRERO, 2, 'manual2'));
        const result = actions.upgradeItem(input, { itemId: 'sword', modifierIdItem: IdItem.MANUAL_DEL_HERRERO }).response;
        expect(result.updatedItems).toEqual([{ id: 'manual' }, { id: 'manual2', cantidad: 1 }]);
    });

    it.each(['yang', 'material', 'modifier', 'targetMaterial', 'maxUpgrade', 'unknownModifier', 'incompatibleModifier'] as const)
    ('rechaza %s antes de tirar y sin mutaciones', reason => {
        const input = character();
        let modifierIdItem: IdItemList | undefined;
        if (reason === 'yang') input.yang = 0;
        if (reason === 'material') input.inventario = input.inventario.filter(item => item.id !== 'material');
        if (reason === 'modifier') {
            input.inventario = input.inventario.filter(item => item.id !== 'manual');
            modifierIdItem = IdItem.MANUAL_DEL_HERRERO;
        }
        if (reason === 'targetMaterial') group.requirementsByUpgrade[6] = [{ idItem: IdItem.ESPADA, quantity: 1 }];
        if (reason === 'maxUpgrade' && input.inventario[0].type === 'equip') input.inventario[0].upgradeLv = 9;
        if (reason === 'unknownModifier') modifierIdItem = IdItem.GARRA_DE_LOBO;
        if (reason === 'incompatibleModifier') {
            modifiers[IdItem.MANUAL_DEL_HERRERO]!.allowedTargetUpgradeLvs = [9];
            modifierIdItem = IdItem.MANUAL_DEL_HERRERO;
        }
        const before = structuredClone(input);
        expect(() => actions.upgradeItem(input, { itemId: 'sword', modifierIdItem })).toThrow(BadRequestException);
        expect(input).toEqual(before);
        expect(roll).not.toHaveBeenCalled();
    });

    it('guarda inventario y yang juntos con la misma sesión desde la ruta HTTP', async () => {
        const input = { ...character(), user_owner: 'owner' };
        repository.getCharacterById.mockResolvedValue(input);
        const response = await request(app.getHttpServer()).post(`/npc/herrero/characters/${characterId}/upgrade`)
            .send({ itemId: 'sword', modifierIdItem: IdItem.MANUAL_DEL_HERRERO }).expect(200);
        expect(response.body.data.outcome).toBe('success');
        expect(repository.getCharacterById).toHaveBeenCalledWith(characterId, session);
        expect(repository.updateCharacterById).toHaveBeenCalledWith(characterId,
            { inventario: expect.any(Array), yang: response.body.data.yang }, session);
        expect(session.endSession).toHaveBeenCalledTimes(1);
    });

    it('rechaza DTOs inválidos sin iniciar una transacción', async () => {
        await request(app.getHttpServer()).post(`/npc/herrero/characters/${characterId}/upgrade`)
            .send({ itemId: 'sword', modifierIdItem: '10000' }).expect(400);
        expect(connection.startSession).not.toHaveBeenCalled();
    });

    it('rechaza personajes ajenos y libera la sesión sin tirar ni guardar', async () => {
        repository.getCharacterById.mockResolvedValue({ ...character(), user_owner: 'other' });
        await expect(forge.upgradeItem(characterId, 'owner', { itemId: 'sword' })).rejects.toThrow(ForbiddenException);
        expect(repository.updateCharacterById).not.toHaveBeenCalled();
        expect(roll).not.toHaveBeenCalled();
        expect(session.endSession).toHaveBeenCalledTimes(1);
    });

    it('propaga errores de guardado y libera la sesión sin mutar el documento leído', async () => {
        const input = { ...character(), user_owner: 'owner' };
        const before = structuredClone(input);
        repository.getCharacterById.mockResolvedValue(input);
        repository.updateCharacterById.mockRejectedValue(new Error('write failed'));
        await expect(forge.upgradeItem(characterId, 'owner', { itemId: 'sword' })).rejects.toThrow('write failed');
        expect(input).toEqual(before);
        expect(session.endSession).toHaveBeenCalledTimes(1);
    });
});
