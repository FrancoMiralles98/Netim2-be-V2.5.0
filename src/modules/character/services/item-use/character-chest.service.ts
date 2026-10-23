import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { ChestType, InventoryItem, ItemDTO, RewardOptions, CharacterPersistence } from 'netim2-shared';
import { Chest } from '../../../item/entities/chest.entity';
import { ItemService } from '../../../item/item.service';
import type { Reward } from 'netim2-shared';
import { Inventory } from '../../../inventory/entities/inventory.entity';
import { RngService } from '../../../shared/services/rng.service';
import { CharacterMapper } from '../../mapper/character-mapper';
import type { CharacterOpenChestResult, ChestGrantedReward, OpenChestRequest } from 'netim2-shared';
import { CharacterBuffService } from './character-buff.service';
import type { CharacterOpenChestBulkResult, OpenChestBulkRequest } from 'netim2-shared';
import { CharacterEntity } from '../../entity/character-entity';

type PreparedReward = { reward: Reward; item?: ItemDTO; quantity: { min: number; max: number } };

@Injectable()
export class CharacterChestService {
    constructor(
        private readonly mapper: CharacterMapper,
        private readonly items: ItemService,
        private readonly rng: RngService,
        private readonly buffs: CharacterBuffService,
    ) {}

    /** Prevalida el peor caso de espacio antes de sortear y consumir una unidad. No persiste. */
    openChest(character: CharacterPersistence, request: OpenChestRequest): CharacterOpenChestResult {
        return this.calculateOpening(character, request, 1, false);
    }

    /** Simula el lote completo sobre una copia; ninguna recompensa parcial se persiste. */
    openChestBulk(character: CharacterPersistence, request: OpenChestBulkRequest): CharacterOpenChestBulkResult {
        const result = this.calculateOpening(character, { itemId: request.itemId }, request.quantity, true);
        return { character: result.character, response: { ...result.response, openedQuantity: request.quantity } };
    }

    private calculateOpening(character: CharacterPersistence, request: OpenChestRequest, count: number, bulk: boolean): CharacterOpenChestResult {
        if (typeof request.itemId !== 'string' || !request.itemId.trim()) throw new BadRequestException('El ID del cofre es obligatorio');
        if (!Number.isSafeInteger(count) || count <= 0) throw new BadRequestException('La cantidad debe ser un entero positivo válido');
        const source = structuredClone(character);
        const saved = source.inventario.find(item => item.id === request.itemId);
        if (!saved) throw new NotFoundException('No se encuentra el cofre en el inventario');
        if (saved.type !== 'utility' || saved.type_utility !== 'chest') throw new BadRequestException('El item seleccionado no es un cofre');
        if (!Number.isSafeInteger(saved.cantidad) || saved.cantidad <= 0) throw new BadRequestException('No hay unidades disponibles del cofre');
        if (saved.cantidad < count) throw new BadRequestException('No hay suficientes unidades del cofre');
        // Las recompensas son configuración del servidor, no un snapshot antiguo del inventario.
        const item = this.items.getUpdatedInventoryItem(saved);
        if (item.type !== 'utility' || item.type_utility !== 'chest') throw new BadRequestException('El catálogo no contiene un cofre válido');
        if (!Number.isFinite(item.lvUtility) || item.lvUtility < 0 || source.lv < item.lvUtility) throw new BadRequestException('El personaje no tiene el nivel requerido');
        if (bulk && (item.rewardConfig !== 'random' || item.allowBulkOpen !== true)) {
            throw new BadRequestException('Este cofre no permite apertura múltiple');
        }
        const chest = new Chest(item, this.rng);
        const options = chest.getAvailableRewards(request.selectedItemIds);
        const available = item.rewardConfig === 'random' ? options.filter(reward => reward.weight > 0) : options;
        const prepared = available.map(reward => this.prepareReward(reward));
        const slots = prepared.map(entry => this.requiredSlots(entry));
        const required = item.rewardConfig === 'random' ? Math.max(...slots) : slots.reduce((total, count) => total + count, 0);
        if (!bulk) this.assertInventorySpace(source.inventario, item, required);

        source.inventario = source.inventario.map(stored => stored.id === item.id ? item : stored);
        const selected: Reward[] = [];
        for (let index = 0; index < count; index++) selected.push(...chest.open(request.selectedItemIds));
        const entity = this.mapper.toDomain(source);
        entity.consumeItemsFromInventory([{ id: item.id, idItem: item.idItem, cantidad: count }]);
        const granted: ChestGrantedReward[] = [];
        let expGain = 0;
        for (const reward of selected) {
            if (reward.type_reward === 'resource') {
                if (reward.type_resource === 'yang') {
                    const total = this.safeTotal(entity.toPrimitives().yang, reward.value_reward);
                    entity.addYang(total - entity.toPrimitives().yang);
                } else expGain = this.safeTotal(expGain, reward.value_reward);
                granted.push({ type: 'resource', resource: reward.type_resource, amount: reward.value_reward });
                continue;
            }
            const base = this.items.getCoreItemInfoByIdItem(reward.idItem);
            const quantity = reward.rewardOptions?.cantidadChances;
            const amount = quantity ? this.rng.randomNumberInRange(quantity.min, quantity.max) : 1;
            const upgrade = reward.rewardOptions?.upgradeChances;
            const upgradeLv = upgrade ? this.rng.randomNumberInRange(upgrade.min, upgrade.max) : undefined;
            if (upgradeLv !== undefined && 'upgradeLv' in base) {
                base.upgradeLv = upgradeLv as typeof base.upgradeLv;
                this.items.getUpdatedImplicitBonus(base);
            }
            const stackable = this.isStackable(base);
            if (stackable && base.type === 'utility') {
                this.addRewardItem(entity, { ...base, cantidad: amount });
            } else {
                for (let count = 0; count < amount; count++) {
                    this.addRewardItem(entity, base.type === 'utility' ? { ...structuredClone(base), cantidad: 1 } : structuredClone(base));
                }
            }
            granted.push({ type: 'item', idItem: base.idItem, quantity: amount,
                ...('upgradeLv' in base ? { upgradeLv: base.upgradeLv } : {}) });
        }
        if (bulk) {
            const originalIds = new Set(character.inventario.map(stored => stored.id));
            const newCount = entity.toPrimitives().inventario.filter(stored => !originalIds.has(stored.id)).length;
            this.assertInventorySpace(character.inventario, item, newCount);
        }
        if (expGain > 0) {
            if (!Number.isFinite(source.exp) || source.exp < 0 || !Number.isFinite(source.exp_next_lv) || source.exp_next_lv <= 0) {
                throw new BadRequestException('El progreso de experiencia no es válido');
            }
            entity.gainExp(expGain);
        }
        const updated = this.mapper.toPersistence(entity);
        const recalculated = expGain > 0 ? this.buffs.refreshBuffs(updated) : undefined;
        const final = recalculated?.character ?? updated;
        // Deltas finales: un mismo stack puede consumirse y recibir recompensas en la misma apertura.
        const original = new Map(character.inventario.map(stored => [stored.id, stored]));
        const current = new Map(final.inventario.map(stored => [stored.id, stored]));
        const updatedItems = character.inventario.flatMap(stored => {
            const next = current.get(stored.id);
            if (!next) return [{ id: stored.id, cantidad: 0 }];
            return stored.type === 'utility' && next.type === 'utility' && stored.cantidad !== next.cantidad
                ? [{ id: stored.id, cantidad: next.cantidad }] : [];
        });
        return { character: final, response: {
            newItems: final.inventario.filter(stored => !original.has(stored.id)), updatedItems,
            rewards: granted, yang: final.yang,
            ...(recalculated ? {
                progress: { lv: final.lv, exp: final.exp, exp_next_lv: final.exp_next_lv,
                    puntos_atributos: final.puntos_atributos, puntos_habilidad: final.puntos_habilidad, atribute_per_lv: final.atribute_per_lv },
                ...recalculated.response,
            } : {}),
        } };
    }

    private addRewardItem(entity: CharacterEntity, item: ItemDTO): void {
        try {
            entity.addItemToInventory(item);
        } catch {
            throw new BadRequestException('No hay espacio suficiente para todos los items de recompensa');
        }
    }

    private prepareReward(reward: Reward): PreparedReward {
        if (reward.type_reward === 'resource') {
            if (!['yang', 'exp'].includes(reward.type_resource) || !Number.isSafeInteger(reward.value_reward) || reward.value_reward < 0) {
                throw new BadRequestException('Recurso de recompensa inválido');
            }
            return { reward, quantity: { min: 0, max: 0 } };
        }
        if (reward.type_reward !== 'item') throw new BadRequestException('Tipo de recompensa inválido');
        const item = this.items.getCoreItemInfoByIdItem(reward.idItem);
        const quantity = reward.rewardOptions?.cantidadChances ?? { min: 1, max: 1 };
        this.assertRange(quantity, 1);
        if (item.type === 'utility' && (!Number.isSafeInteger(item.maxCantidad) || item.maxCantidad < 1)) {
            throw new BadRequestException('El máximo de unidades del item no es válido');
        }
        const upgrade = reward.rewardOptions?.upgradeChances;
        if (upgrade) {
            this.assertRange(upgrade, 0);
            if (!('upgradeLv' in item) || !('upgradeMax' in item) || upgrade.max > item.upgradeMax) {
                throw new BadRequestException('El rango de mejora no es compatible con el item');
            }
        }
        return { reward, item, quantity };
    }

    private assertRange(range: NonNullable<RewardOptions['cantidadChances']>, min: number): void {
        if (!range || !Number.isSafeInteger(range.min) || !Number.isSafeInteger(range.max) || range.min < min || range.min > range.max) {
            throw new BadRequestException('Rango de recompensa inválido');
        }
    }

    private isStackable(item: ItemDTO): boolean {
        return item.type === 'utility' && item.acc && !(item.type_utility === 'poción' && item.potionType === 'reserve');
    }

    private requiredSlots(entry: PreparedReward): number {
        if (!entry.item) return 0;
        return this.isStackable(entry.item) && entry.item.type === 'utility'
            ? Math.ceil(entry.quantity.max / entry.item.maxCantidad) : entry.quantity.max;
    }

    private assertInventorySpace(items: InventoryItem[], chest: ChestType, count: number): void {
        const occupied = structuredClone(items);
        const inventory = new Inventory(occupied);
        const placeholder = { ...chest, size: { rows: 3, cols: 1 } };
        for (let index = 0; index < count; index++) {
            const position = inventory.findFirstAvailableSpace(placeholder);
            if (!position) throw new BadRequestException('No hay espacio suficiente: se requiere un espacio de 1 × 3 por item de recompensa');
            occupied.push({ ...placeholder, id: `reserved-${index}`, position });
        }
    }

    private safeTotal(current: number, amount: number): number {
        const total = current + amount;
        if (!Number.isSafeInteger(current) || current < 0 || !Number.isSafeInteger(total)) throw new BadRequestException('El saldo de recursos no es válido');
        return total;
    }
}
