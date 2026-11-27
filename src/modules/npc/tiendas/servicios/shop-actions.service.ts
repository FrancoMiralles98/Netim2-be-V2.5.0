import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import type { AddItemResult, CharacterPersistence, InventoryItem } from 'netim2-shared';
import { Inventory } from '../../../inventory/entities/inventory.entity';
import { ItemService } from '../../../item/item.service';
import type { ShopActionResult } from '../types/shop-action-result.type';
import type { BuyShopItemRequest, BuyShopItemResponse, NpcShopId, SellShopItemRequest, SellShopItemResponse } from 'netim2-shared';
import { ShopCatalogService } from './shop-catalog.service';

/** Ejecuta compras y ventas en memoria, sobre copias del inventario del personaje. */
@Injectable()
export class ShopActionsService {
    constructor(private readonly catalog: ShopCatalogService, private readonly items: ItemService) {}

    /** Comprueba oferta, lotes, fondos y capacidad completa antes de devolver cambios. */
    buyItem(character: CharacterPersistence, shopId: NpcShopId, request: BuyShopItemRequest): ShopActionResult<BuyShopItemResponse> {
        const offer = this.catalog.getOffer(shopId, request.idItem, request.upgradeLv);
        const quantity = request.quantity ?? offer.quantity;
        this.validateQuantity(quantity);
        if (quantity > offer.maxQuantity || quantity % offer.quantity !== 0) {
            throw new BadRequestException(`La cantidad debe ser múltiplo de ${offer.quantity} y no superar ${offer.maxQuantity}`);
        }
        const totalPrice = offer.price * quantity;
        this.validateYang(character.yang);
        this.validateYang(totalPrice);
        if (character.yang < totalPrice) throw new BadRequestException('No tienes suficiente yang');
        const inventory = new Inventory(structuredClone(character.inventario));
        const item = structuredClone(offer.item);
        try {
            if (item.type === 'utility' && item.acc && !(item.type_utility === 'poción' && item.potionType === 'reserve')) {
                item.cantidad = quantity;
                inventory.addItem(item);
            } else {
                if (item.type === 'utility') item.cantidad = 1;
                for (let i = 0; i < quantity; i++) inventory.addItem(structuredClone(item));
            }
        } catch (error) {
            throw new BadRequestException(error instanceof Error ? error.message : 'No hay espacio para la compra completa');
        }
        const inventario = inventory.getInventory();
        const yang = character.yang - totalPrice;
        return { changes: { inventario, yang }, response: { shopId, idItem: offer.idItem, quantity, totalPrice, yang,
            ...this.getInventoryChanges(character.inventario, inventario) } };
    }

    /** Vende unidades de una instancia existente usando el precio del catálogo de ítems. */
    sellItem(character: CharacterPersistence, shopId: NpcShopId, request: SellShopItemRequest): ShopActionResult<SellShopItemResponse> {
        this.catalog.validateShop(shopId);
        const quantity = request.quantity ?? 1;
        this.validateQuantity(quantity);
        const stored = character.inventario.find(item => item.id === request.itemId);
        if (!stored) throw new NotFoundException('El ítem no está en el inventario');
        if (stored.type === 'utility') {
            if (!Number.isSafeInteger(stored.cantidad) || stored.cantidad < quantity) {
                throw new BadRequestException('No tienes la cantidad de ítems solicitada');
            }
        } else if (quantity !== 1) throw new BadRequestException('Solo se puede vender una unidad de equipo por instancia');

        const [base] = this.items.getItems({ items: [{ idItem: stored.idItem }] });
        if (!Number.isSafeInteger(base.price) || base.price < 0) throw new InternalServerErrorException('Precio de venta inválido');
        const totalPrice = base.price * quantity;
        this.validateYang(character.yang);
        this.validateYang(totalPrice);
        const yang = character.yang + totalPrice;
        this.validateYang(yang);
        const inventory = new Inventory(structuredClone(character.inventario));
        inventory.removeItemById(stored.id, stored.type === 'utility' ? quantity : undefined);
        return { changes: { inventario: inventory.getInventory(), yang }, response: {
            shopId, itemId: stored.id, quantity, totalPrice, yang,
            updatedItems: [stored.type === 'utility' ? { id: stored.id, cantidad: stored.cantidad - quantity } : { id: stored.id }],
        } };
    }

    /** Calcula deltas finales para no duplicar stacks creados o modificados durante un lote. */
    private getInventoryChanges(before: InventoryItem[], after: InventoryItem[]): AddItemResult {
        const original = new Map(before.map(item => [item.id, item]));
        const updatedItems: AddItemResult['updatedItems'] = [];
        for (const item of after) {
            const previous = original.get(item.id);
            if (previous?.type === 'utility' && item.type === 'utility' && previous.cantidad !== item.cantidad) {
                updatedItems.push({ id: item.id, cantidad: item.cantidad });
            }
        }
        return { newItems: after.filter(item => !original.has(item.id)), updatedItems };
    }

    private validateQuantity(quantity: number): void {
        if (!Number.isSafeInteger(quantity) || quantity < 1) throw new BadRequestException('La cantidad debe ser un entero positivo');
    }

    private validateYang(amount: number): void {
        if (!Number.isSafeInteger(amount) || amount < 0) throw new BadRequestException('La operación excede los límites de yang');
    }
}
