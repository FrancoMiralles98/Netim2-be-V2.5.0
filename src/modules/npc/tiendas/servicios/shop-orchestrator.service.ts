import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import type { CharacterPersistence } from 'netim2-shared';
import { CharacterRepository } from '../../../character/repository/character-repository';
import { CharacterMapper } from '../../../character/mapper/character-mapper';
import type { ShopActionResult } from '../types/shop-action-result.type';
import type { BuyShopItemRequest, BuyShopItemResponse, GetShopItemsResponse, NpcShopId, SellShopItemRequest, SellShopItemResponse } from 'netim2-shared';
import { ShopActionsService } from './shop-actions.service';
import { ShopCatalogService } from './shop-catalog.service';

/** Conecta las tiendas con HTTP y guarda inventario y yang bajo la misma transacción. */
@Injectable()
export class ShopOrchestratorService {
    constructor(
        private readonly catalog: ShopCatalogService,
        private readonly actions: ShopActionsService,
        private readonly repository: CharacterRepository,
        private readonly mapper: CharacterMapper,
        @InjectConnection() private readonly connection: Connection,
    ) {}

    /** Consulta el catálogo de la tienda sin modificar personajes. */
    getItems(shopId: NpcShopId): GetShopItemsResponse {
        return this.catalog.getItems(shopId);
    }

    /** Compra una oferta del servidor para el personaje de la cuenta autenticada. */
    buyItem(characterId: string, accountId: string, shopId: NpcShopId, request: BuyShopItemRequest): Promise<BuyShopItemResponse> {
        return this.execute(characterId, accountId, character => this.actions.buyItem(character, shopId, request));
    }

    /** Vende una instancia del inventario del personaje autenticado. */
    sellItem(characterId: string, accountId: string, shopId: NpcShopId, request: SellShopItemRequest): Promise<SellShopItemResponse> {
        return this.execute(characterId, accountId, character => this.actions.sellItem(character, shopId, request));
    }

    /** Relee y recalcula cada intento para evitar saldos e inventarios perdidos ante concurrencia. */
    private async execute<T>(characterId: string, accountId: string,
        action: (character: CharacterPersistence) => ShopActionResult<T>): Promise<T> {
        const session = await this.connection.startSession();
        try {
            return await session.withTransaction(async () => {
                const document = await this.repository.getCharacterById(characterId, session);
                if (String(document.user_owner) !== accountId) throw new ForbiddenException('El personaje no pertenece a esta cuenta');
                const result = action(this.mapper.fromDb(document));
                await this.repository.updateCharacterById(characterId, result.changes, session);
                return result.response;
            });
        } finally {
            await session.endSession();
        }
    }
}
