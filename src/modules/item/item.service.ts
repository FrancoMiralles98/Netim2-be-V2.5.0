import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EQUIP_RULES } from './config/items-rule.const';
import { ITEM_LV_REROLL_CONFIG } from './config/item-lv-reroll.config';
import { TierReroll } from './types/item-lv-reroll.type';
import { RngService } from '../shared/services/rng.service';
import { ITEM_LIST } from './const/items.const';
import { ItemImplicitBonusService } from './services/implicitScaling/item-implicit-bonus.service';
import { ItemHydrationService } from './services/item-hydration.service';
import { RandomImplicitBonusService } from './services/implicitScaling/random-implicit-bonus.service';
import { ItemFactory } from './factories/item-factory';
import { Chest } from './entities/chest.entity';
import type { Reward } from 'netim2-shared';
import type { GetItemsRequest, GetItemsResponse } from 'netim2-shared';
import { ITEM_SCALING_CONST } from './const/scaling/item-scaling.const';
import { BonusInItem, EquipType, IdItemList, InventoryItem, ItemDTO, subTypeEquip, UpgradeLv } from 'netim2-shared';

@Injectable()
export class ItemService {

    constructor(
        private rngService: RngService,
        private itemImplicitBonusService: ItemImplicitBonusService,
        private itemHydrationService: ItemHydrationService,
        private itemFactory: ItemFactory,
        private randomImplicitBonusService: RandomImplicitBonusService,
    ) { }

    /** Resuelve consultas de catálogo sobre copias; no crea instancias ni modifica inventarios. */
    getItems(request: GetItemsRequest): GetItemsResponse {
        if (!request || !Array.isArray(request.items)) {
            throw new BadRequestException('items debe ser un array');
        }
        const catalog = new Map(ITEM_LIST.map(item => [item.idItem, item]));
        return request.items.map(query => {
            if (!query || typeof query !== 'object' || !Number.isSafeInteger(query.idItem)) {
                throw new BadRequestException('Cada item debe indicar un idItem válido del catálogo');
            }
            const base = catalog.get(query.idItem);
            if (!base) throw new NotFoundException(`No se encuentra el item ${query.idItem} en el catálogo`);
            const item = structuredClone(base);
            if (query.upgradeLv !== undefined) {
                if (!('upgradeLv' in item) || !('upgradeMax' in item)) {
                    throw new BadRequestException(`El item ${query.idItem} no admite mejoras`);
                }
                if (!Number.isSafeInteger(query.upgradeLv) || query.upgradeLv < 0 || query.upgradeLv > item.upgradeMax) {
                    throw new BadRequestException(`La mejora del item ${query.idItem} debe estar entre 0 y ${item.upgradeMax}`);
                }
                item.upgradeLv = query.upgradeLv;
            }
            if (query.quantity !== undefined) {
                if (item.type !== 'utility' || item.acc !== true ||
                    (item.type_utility === 'poción' && item.potionType === 'reserve')) {
                    throw new BadRequestException(`El item ${query.idItem} no admite una cantidad apilable`);
                }
                if (!Number.isSafeInteger(query.quantity) || query.quantity <= 0 || query.quantity > item.maxCantidad) {
                    throw new BadRequestException(`La cantidad del item ${query.idItem} debe estar entre 1 y ${item.maxCantidad}`);
                }
                item.cantidad = query.quantity;
            }
            // Algunos catálogos aún no tienen escalado; se conservan sus bonus base.
            return ITEM_SCALING_CONST.some(config => config.idItems.includes(item.idItem))
                ? this.getUpdatedImplicitBonus(item)
                : item;
        });
    }

    generateRandomImplicitBonus(
        lvReq: number,
        upgradeLv: UpgradeLv,
        sub_type_equip: subTypeEquip
    ): BonusInItem[] {
        return this.randomImplicitBonusService.generateRandomImplicitBonus(lvReq, upgradeLv, sub_type_equip)
    }

    openChest(item: InventoryItem, selectedItemIds?: IdItemList[]): Reward[] {
        const chest = this.itemFactory.create(item)
        if (!(chest instanceof Chest)) {
            throw new Error('el item tiene que ser de tipo chest')
        }

        return chest.open(selectedItemIds)
    }


    getCoreItemInfoByIdItem(
        idItem: IdItemList,
    ): ItemDTO {
        const itemBaseInfo = structuredClone(ITEM_LIST.find(item => item.idItem === idItem))

        if (!itemBaseInfo) {
            throw new Error(`item not found ${idItem}`)
        }

        this.itemImplicitBonusService.getUpdatedImplicits(itemBaseInfo)

        return itemBaseInfo
    }

    getUpdatedImplicitBonus(item: ItemDTO): ItemDTO {
        this.itemImplicitBonusService.getUpdatedImplicits(item)
        return item
    }

    


    getUpdatedInventoryItem(
        item: InventoryItem
    ): InventoryItem {
        const baseItem = this.getCoreItemInfoByIdItem(item.idItem)

        const hydrated = structuredClone(this.itemHydrationService.hydrateInventoryItem(baseItem, item))
        // El escalado debe usar la mejora y los bonus aleatorios de la instancia guardada.
        this.itemImplicitBonusService.getUpdatedImplicits(hydrated)
        return hydrated
    }

    /** Actualiza un equipo conservando su identidad, mejoras y bonus propios, sin mutarlo. */
    getUpdatedEquipmentItem<T extends EquipType>(item: T): T {
        const baseItem = this.getCoreItemInfoByIdItem(item.idItem)
        const hydrated = this.itemHydrationService.hydrateEquipmentItem(baseItem, item)
        this.itemImplicitBonusService.getUpdatedImplicits(hydrated)
        return hydrated
    }

    rollItemLv(lvReq: number, bonification?: number): number {
        const distanceToMax = EQUIP_RULES.MAX__NORMAL_ITEM_LV - lvReq;

        const config = ITEM_LV_REROLL_CONFIG.find(c =>
            distanceToMax >= c.minDistance &&
            distanceToMax <= c.maxDistance
        );

        if (!config) {
            throw new Error(`No reroll config for distance: ${distanceToMax}`);
        }

        const tier = this.getWeightedTier(config.tier);

        const maxAllowedBonus = Math.min(tier.maxBonusLv, distanceToMax);

        let bonusLv = this.rngService.randomNumberInRange(
            tier.minBonusLv,
            maxAllowedBonus
        );

        bonusLv += bonification || 0

        return lvReq + bonusLv;
    }



    private getWeightedTier(tiers: TierReroll[]) {
        const random = Math.random() * 100;
        let accumulated = 0;

        for (const tier of tiers) {
            accumulated += tier.probability;

            if (random <= accumulated) {
                return tier;
            }
        }

        return tiers[tiers.length - 1];
    }
}
