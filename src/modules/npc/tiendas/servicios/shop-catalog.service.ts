import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import type { IdItemList, UpgradeLv } from 'netim2-shared';
import { ItemService } from '../../../item/item.service';
import { NPC_SHOP_ITEMS } from '../const/shop-items.const';
import { NPC_SHOP_IDS } from 'netim2-shared/dist/npc/shop.types';
import type { GetShopItemsResponse, NpcShopId, ShopItemConfig, ShopItemOffer } from 'netim2-shared';

/** Resuelve los ítems de cada tienda y normaliza sus límites y precios. */
@Injectable()
export class ShopCatalogService {
    constructor(private readonly items: ItemService) {}

    /** Valida la tienda también para consumidores internos, fuera de HTTP. */
    validateShop(shopId: NpcShopId): void {
        if (!NPC_SHOP_IDS.includes(shopId)) throw new BadRequestException('Tienda inválida');
    }

    /** Devuelve copias completas del catálogo y los valores efectivos de cada oferta. */
    getItems(shopId: NpcShopId): GetShopItemsResponse {
        this.validateShop(shopId);
        const items = NPC_SHOP_ITEMS[shopId].map(config => this.resolveOffer(config));
        const keys = items.map(item => `${item.idItem}:${item.upgradeLv ?? 0}`);
        if (new Set(keys).size !== keys.length) throw new InternalServerErrorException('Hay ofertas duplicadas en la tienda');
        return { shopId, currency: 'yang', items };
    }

    /** Solo permite comprar una oferta existente con la mejora configurada. */
    getOffer(shopId: NpcShopId, idItem: IdItemList, upgradeLv: UpgradeLv = 0): ShopItemOffer {
        if (!Number.isSafeInteger(upgradeLv) || upgradeLv < 0) throw new BadRequestException('Mejora inválida');
        const offer = this.getItems(shopId).items.find(item => item.idItem === idItem && (item.upgradeLv ?? 0) === upgradeLv);
        if (!offer) throw new NotFoundException('El ítem o su mejora no se vende en esta tienda');
        return offer;
    }

    /** Completa defaults sin modificar ni el catálogo de ítems ni la configuración de tienda. */
    private resolveOffer(config: ShopItemConfig): ShopItemOffer {
        const [base] = this.items.getItems({ items: [{ idItem: config.idItem }] });
        if (config.upgradeLv !== undefined && base.type !== 'equip') {
            throw new InternalServerErrorException('upgradeLv solo se configura en ofertas de equipo');
        }
        const upgradeLv = base.type === 'equip' ? config.upgradeLv ?? 0 : undefined;
        const item = 'upgradeLv' in base
            ? this.items.getItems({ items: [{ idItem: config.idItem, upgradeLv: upgradeLv ?? 0 }] })[0]
            : base;
        const quantity = config.quantity ?? 1;
        const maxQuantity = config.maxQuantity ?? (item.type === 'utility' ? item.maxCantidad : 1);
        for (const value of [quantity, maxQuantity]) {
            if (!Number.isSafeInteger(value) || value < 1) throw new InternalServerErrorException('Límites de tienda inválidos');
        }
        if (quantity > maxQuantity) throw new InternalServerErrorException('El lote supera el máximo de compra');
        for (const price of [config.price, item.price, config.price * quantity, config.price * maxQuantity]) {
            if (!Number.isSafeInteger(price) || price < 0) throw new InternalServerErrorException('Precio de tienda inválido');
        }
        if (item.type === 'utility') {
            item.cantidad = item.acc && !(item.type_utility === 'poción' && item.potionType === 'reserve') ? quantity : 1;
        }
        return { idItem: config.idItem, item, price: config.price, sellPrice: item.price,
            quantity, maxQuantity, upgradeLv, bundlePrice: config.price * quantity };
    }
}
