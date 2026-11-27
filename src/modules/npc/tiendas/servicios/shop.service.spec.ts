import { BadRequestException, ConflictException, ForbiddenException, INestApplication, InternalServerErrorException, NotFoundException, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/mongoose';
import request = require('supertest');
import { IdItem, InventoryItem, ItemDTO } from 'netim2-shared';
import { AccessTokenGuard } from '../../../auth/guards/access-token.guard';
import { GENERAL_CHARACTER } from '../../../character/const/general-character.const';
import { CharacterMapper } from '../../../character/mapper/character-mapper';
import { CharacterRepository } from '../../../character/repository/character-repository';
import { ItemModule } from '../../../item/item.module';
import { ItemService } from '../../../item/item.service';
import { POCION_LIST } from '../../../item/const/miscs/pocion/pocion-list.const';
import { createPocionItem } from '../../../item/factories/item-builder';
import { NPC_SHOP_ITEMS } from '../const/shop-items.const';
import { ShopController } from '../controller/shop.controller';
import { ShopActionsService } from './shop-actions.service';
import { ShopCatalogService } from './shop-catalog.service';
import { ShopOrchestratorService } from './shop-orchestrator.service';
import { NPC_SHOP_IDS } from 'netim2-shared/dist/npc/shop.types';

describe('Tiendas NPC', () => {
    let module: TestingModule;
    let app: INestApplication;
    let catalog: ShopCatalogService;
    let actions: ShopActionsService;
    let shops: ShopOrchestratorService;
    let items: ItemService;
    const characterId = '507f1f77bcf86cd799439011';
    const potionId = POCION_LIST[0].idItem;
    const initialCatalog = structuredClone(NPC_SHOP_ITEMS);
    const repository = { getCharacterById: jest.fn(), updateCharacterById: jest.fn() };
    const session = { withTransaction: jest.fn(async callback => callback()), endSession: jest.fn() };
    const guard = { canActivate: jest.fn(context => {
        context.switchToHttp().getRequest().user = { accountId: 'owner' };
        return true;
    }) };

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [ItemModule], controllers: [ShopController],
            providers: [ShopCatalogService, ShopActionsService, ShopOrchestratorService,
                { provide: CharacterRepository, useValue: repository },
                { provide: CharacterMapper, useValue: { fromDb: document => document } },
                { provide: getConnectionToken(), useValue: { startSession: async () => session } }],
        }).overrideGuard(AccessTokenGuard).useValue(guard).compile();
        catalog = module.get(ShopCatalogService);
        actions = module.get(ShopActionsService);
        shops = module.get(ShopOrchestratorService);
        items = module.get(ItemService);
        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();
    });
    afterAll(async () => {
        for (const shopId of NPC_SHOP_IDS) NPC_SHOP_ITEMS[shopId].splice(0, Infinity, ...initialCatalog[shopId]);
        await app.close();
    });
    beforeEach(() => {
        jest.clearAllMocks();
        for (const shopId of NPC_SHOP_IDS) NPC_SHOP_ITEMS[shopId].length = 0;
        repository.getCharacterById.mockResolvedValue({ ...character(), user_owner: 'owner' });
        repository.updateCharacterById.mockResolvedValue({});
    });

    function character() { return { ...structuredClone(GENERAL_CHARACTER), inventario: [] as InventoryItem[], yang: 10000 }; }
    function offer(quantity?: number, maxQuantity?: number) {
        NPC_SHOP_ITEMS.general.push({ idItem: potionId, price: 40, quantity, maxQuantity });
    }
    function inventoryItem(item: ItemDTO, id = 'stored'): InventoryItem {
        return { ...structuredClone(item), id, position: { row: 0, col: 0 } };
    }

    it('mantiene listas independientes y vacías para las cinco tiendas', () => {
        for (const shopId of NPC_SHOP_IDS) expect(catalog.getItems(shopId)).toEqual({ shopId, currency: 'yang', items: [] });
    });

    it('normaliza utility a 1 unidad y su máximo; separa precio de compra y venta', () => {
        offer();
        const result = catalog.getItems('general').items[0];
        expect(result).toMatchObject({ quantity: 1, maxQuantity: POCION_LIST[0].maxCantidad,
            price: 40, sellPrice: POCION_LIST[0].price, bundlePrice: 40, item: { cantidad: 1 } });
        result.item.name = 'modificado';
        expect(catalog.getItems('general').items[0].item.name).not.toBe('modificado');
        expect(NPC_SHOP_ITEMS.general[0].quantity).toBeUndefined();
    });

    it('usa +0 por defecto y distingue ofertas de equipo con mejoras diferentes', () => {
        NPC_SHOP_ITEMS.weapons.push({ idItem: IdItem.ESPADA, price: 100 },
            { idItem: IdItem.ESPADA, price: 300, upgradeLv: 3 });
        const offers = catalog.getItems('weapons').items;
        expect(offers[0]).toMatchObject({ quantity: 1, maxQuantity: 1, upgradeLv: 0, item: { upgradeLv: 0 } });
        const result = actions.buyItem(character(), 'weapons', { idItem: IdItem.ESPADA, upgradeLv: 3 });
        expect(result.response).toMatchObject({ quantity: 1, totalPrice: 300, newItems: [{ upgradeLv: 3 }] });
        expect(() => actions.buyItem(character(), 'weapons', { idItem: IdItem.ESPADA, upgradeLv: 2 })).toThrow(NotFoundException);
    });

    it('cobra el lote por unidades y permite comprar múltiplos', () => {
        offer(10, 50);
        const source = character();
        const before = structuredClone(source);
        const defaultBuy = actions.buyItem(source, 'general', { idItem: potionId });
        expect(defaultBuy.response).toMatchObject({ quantity: 10, totalPrice: 400, yang: 9600,
            newItems: [{ cantidad: 10 }], updatedItems: [] });
        const bigger = actions.buyItem(source, 'general', { idItem: potionId, quantity: 20 });
        expect(bigger.response.totalPrice).toBe(800);
        expect(source).toEqual(before);
    });

    it.each([0, -1, 1.5, 15, 60, Number.MAX_SAFE_INTEGER + 1])('rechaza cantidad inválida o fuera de lote/máximo: %s', quantity => {
        offer(10, 50);
        expect(() => actions.buyItem(character(), 'general', { idItem: potionId, quantity })).toThrow(BadRequestException);
    });

    it('no permite comprar ítems ajenos a la tienda ni gastar más yang del disponible', () => {
        offer();
        expect(() => actions.buyItem(character(), 'fishing', { idItem: potionId })).toThrow(NotFoundException);
        expect(() => actions.buyItem({ ...character(), yang: 39 }, 'general', { idItem: potionId })).toThrow(BadRequestException);
    });

    it('apila hasta el máximo y crea el resto con deltas finales', () => {
        offer(1, 400);
        const source = character();
        const potion = items.getItems({ items: [{ idItem: potionId, quantity: 195 }] })[0];
        source.inventario = [inventoryItem(potion)];
        const result = actions.buyItem(source, 'general', { idItem: potionId, quantity: 20 });
        expect(result.response.updatedItems).toEqual([{ id: 'stored', cantidad: 200 }]);
        expect(result.response.newItems).toHaveLength(1);
        expect(result.response.newItems[0]).toMatchObject({ cantidad: 15 });
        expect(source.inventario[0]).toMatchObject({ cantidad: 195 });
    });

    it('crea instancias independientes para pociones con reserva', () => {
        const reserve = createPocionItem({
            idItem: IdItem.POCION_ROJA_M, name: 'Poción de reserva de prueba', img: '', description: '',
            price: 100, maxCantidad: 200, potionType: 'reserve', resource: ['hp'],
            reserve: { actual: 1000, max: 1000 },
        });
        NPC_SHOP_ITEMS.general.push({ idItem: reserve.idItem, price: 100 });
        const getItems = jest.spyOn(items, 'getItems').mockReturnValueOnce([reserve]);
        try {
            const result = actions.buyItem(character(), 'general', { idItem: reserve.idItem, quantity: 2 });
            expect(result.response.newItems).toHaveLength(2);
            expect(new Set(result.response.newItems.map(item => item.id)).size).toBe(2);
            expect(result.response.newItems.every(item => item.type === 'utility' && item.cantidad === 1)).toBe(true);
        } finally {
            getItems.mockRestore();
        }
    });

    it('rechaza una compra cuyo lote no entra completo, sin modificar el original', () => {
        const source = character();
        const filler = { ...POCION_LIST[0], cantidad: 1, acc: false, size: { rows: 1, cols: 1 } };
        const weapon = items.getItems({ items: [{ idItem: IdItem.ESPADA }] })[0];
        source.inventario = Array.from({ length: 114 }, (_, index) => ({ ...structuredClone(filler), id: String(index),
            position: { row: Math.floor(index / 19), col: index % 19 } }))
            .filter(item => item.position.row >= weapon.size.rows || item.position.col >= weapon.size.cols);
        NPC_SHOP_ITEMS.weapons.push({ idItem: IdItem.ESPADA, price: 100, maxQuantity: 2 });
        const before = structuredClone(source);
        expect(() => actions.buyItem(source, 'weapons', { idItem: IdItem.ESPADA, quantity: 2 })).toThrow(BadRequestException);
        expect(source).toEqual(before);
    });

    it('descarta el apilado parcial si el resto de la compra no entra', () => {
        offer();
        const source = character();
        const potion = items.getItems({ items: [{ idItem: potionId, quantity: 195 }] })[0];
        const filler = { ...POCION_LIST[0], cantidad: 1, acc: false, size: { rows: 1, cols: 1 } };
        source.inventario = [inventoryItem(potion), ...Array.from({ length: 113 }, (_, i) => ({
            ...structuredClone(filler), id: String(i), position: { row: Math.floor((i + 1) / 19), col: (i + 1) % 19 },
        }))];
        const before = structuredClone(source);
        expect(() => actions.buyItem(source, 'general', { idItem: potionId, quantity: 10 })).toThrow(BadRequestException);
        expect(source).toEqual(before);
    });

    it('vende una cantidad parcial al precio item.price, independientemente del precio de compra', () => {
        offer();
        const source = character();
        const potion = items.getItems({ items: [{ idItem: potionId, quantity: 20 }] })[0];
        source.inventario = [inventoryItem(potion)];
        const result = actions.sellItem(source, 'general', { itemId: 'stored', quantity: 5 });
        expect(result.response).toMatchObject({ totalPrice: POCION_LIST[0].price * 5,
            yang: 10000 + POCION_LIST[0].price * 5, updatedItems: [{ id: 'stored', cantidad: 15 }] });
        expect(source.inventario[0]).toMatchObject({ cantidad: 20 });
    });

    it('elimina todo el stack al vender su cantidad completa', () => {
        const source = character();
        source.inventario = [inventoryItem({ ...POCION_LIST[0], cantidad: 5 })];
        const result = actions.sellItem(source, 'armors', { itemId: 'stored', quantity: 5 });
        expect(result.changes.inventario).toEqual([]);
        expect(result.response.updatedItems).toEqual([{ id: 'stored', cantidad: 0 }]);
    });

    it('vende un equipo por instancia y rechaza cantidades mayores a 1', () => {
        const source = character();
        source.inventario = [inventoryItem(items.getItems({ items: [{ idItem: IdItem.ESPADA }] })[0])];
        expect(() => actions.sellItem(source, 'weapons', { itemId: 'stored', quantity: 2 })).toThrow(BadRequestException);
        const result = actions.sellItem(source, 'weapons', { itemId: 'stored' });
        expect(result.changes.inventario).toEqual([]);
        expect(result.response.updatedItems).toEqual([{ id: 'stored' }]);
    });

    it('rechaza ventas inexistentes, cantidades insuficientes y desbordamientos de saldo', () => {
        const source = character();
        expect(() => actions.sellItem(source, 'general', { itemId: 'missing' })).toThrow(NotFoundException);
        source.inventario = [inventoryItem({ ...POCION_LIST[0], cantidad: 5 })];
        expect(() => actions.sellItem(source, 'general', { itemId: 'stored', quantity: 6 })).toThrow(BadRequestException);
        expect(() => actions.sellItem({ ...source, yang: Number.MAX_SAFE_INTEGER }, 'general', { itemId: 'stored' })).toThrow(BadRequestException);
    });

    it('detecta configuraciones inválidas y ofertas duplicadas', () => {
        offer(10, 5);
        expect(() => catalog.getItems('general')).toThrow(InternalServerErrorException);
        NPC_SHOP_ITEMS.general.length = 0;
        offer(); offer();
        expect(() => catalog.getItems('general')).toThrow(InternalServerErrorException);
    });

    it('lista el catálogo mediante HTTP y valida el identificador de tienda', async () => {
        await request(app.getHttpServer()).get('/npc/shops/general/items').expect(200)
            .expect({ data: { shopId: 'general', currency: 'yang', items: [] } });
        await request(app.getHttpServer()).get('/npc/shops/invalid/items').expect(400);
    });

    it('compra por HTTP y guarda inventario/yang juntos en la sesión', async () => {
        offer();
        const { body } = await request(app.getHttpServer()).post(`/npc/shops/general/characters/${characterId}/buy`)
            .send({ idItem: potionId, price: 0 }).expect(200);
        expect(body.data.totalPrice).toBe(40);
        expect(repository.getCharacterById).toHaveBeenCalledWith(characterId, session);
        expect(repository.updateCharacterById).toHaveBeenCalledWith(characterId,
            { inventario: body.data.newItems, yang: 9960 }, session);
        expect(session.endSession).toHaveBeenCalledTimes(1);
    });

    it('vende por HTTP sin requerir que el NPC ofrezca ese ítem en su catálogo', async () => {
        const source = character();
        source.inventario = [inventoryItem({ ...POCION_LIST[0], cantidad: 2 })];
        repository.getCharacterById.mockResolvedValueOnce({ ...source, user_owner: 'owner' });
        const { body } = await request(app.getHttpServer()).post(`/npc/shops/general/characters/${characterId}/sell`)
            .send({ itemId: 'stored' }).expect(200);
        expect(body.data.totalPrice).toBe(POCION_LIST[0].price);
        expect(body.data.updatedItems).toEqual([{ id: 'stored', cantidad: 1 }]);
    });

    it('verifica propiedad en el orquestador y no guarda acciones fallidas', async () => {
        offer();
        repository.getCharacterById.mockResolvedValueOnce({ ...character(), user_owner: 'other' });
        await expect(shops.buyItem(characterId, 'owner', 'general', { idItem: potionId })).rejects.toBeInstanceOf(ForbiddenException);
        repository.getCharacterById.mockResolvedValueOnce({ ...character(), yang: 0, user_owner: 'owner' });
        await expect(shops.buyItem(characterId, 'owner', 'general', { idItem: potionId })).rejects.toBeInstanceOf(BadRequestException);
        expect(repository.updateCharacterById).not.toHaveBeenCalled();
        expect(session.endSession).toHaveBeenCalledTimes(2);
    });

    it('propaga un fallo al guardar para abortar la transacción', async () => {
        offer();
        repository.updateCharacterById.mockRejectedValueOnce(new ConflictException());
        await expect(shops.buyItem(characterId, 'owner', 'general', { idItem: potionId })).rejects.toBeInstanceOf(ConflictException);
        expect(session.endSession).toHaveBeenCalledTimes(1);
    });

    it('rechaza DTOs inválidos antes de cargar el personaje', async () => {
        await request(app.getHttpServer()).post(`/npc/shops/general/characters/${characterId}/buy`)
            .send({ idItem: potionId, quantity: -1 }).expect(400);
        await request(app.getHttpServer()).post(`/npc/shops/general/characters/${characterId}/sell`)
            .send({ itemId: '' }).expect(400);
        await request(app.getHttpServer()).post('/npc/shops/general/characters/invalid/buy')
            .send({ idItem: potionId }).expect(400);
        expect(repository.getCharacterById).not.toHaveBeenCalled();
    });

    it('requiere autenticación para acceder al catálogo', async () => {
        guard.canActivate.mockReturnValueOnce(false);
        await request(app.getHttpServer()).get('/npc/shops/general/items').expect(403);
    });
});
