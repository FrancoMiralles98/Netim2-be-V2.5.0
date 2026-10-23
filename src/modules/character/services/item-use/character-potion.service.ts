import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { CharacterPersistence, InventoryChangeResult, InventoryItem, PocionType, PotionReserve, ReservePotion, CharacterPotionUseResult, UsePotionRequest, CharacterReservePotionUseResult, UseReservePotionRequest, CharacterQuickHealResult, QuickHealRequest, QuickHealResponse } from 'netim2-shared';
import { CharacterMapper } from '../../mapper/character-mapper';

@Injectable()
export class CharacterPotionService {
    constructor(private readonly characterMapper: CharacterMapper) {}

    /** Prioriza menor recuperación por activación para cada recurso */
    quickHeal(character: CharacterPersistence, resources: QuickHealRequest['resources']): CharacterQuickHealResult {
        if (!Array.isArray(resources) || resources.length === 0 ||
            resources.some(resource => resource !== 'hp' && resource !== 'mana') ||
            new Set(resources).size !== resources.length) {
            throw new BadRequestException('Los recursos deben ser hp y/o mana, sin repetidos');
        }
        let current = structuredClone(character);
        for (const resource of ['hp', 'mana'] as const) {
            const pool = current.stats.general[resource];
            if (!Number.isFinite(pool.actual) || !Number.isFinite(pool.max) ||
                pool.actual < 0 || pool.max < 0 || pool.actual > pool.max) {
                throw new BadRequestException('Los recursos actuales deben estar entre cero y su máximo');
            }
        }
        const changes = new Map<string, InventoryChangeResult>();
        const reserves = new Map<string, QuickHealResponse['updatedPotions'][number]>();
        for (const resource of resources) {
            const candidates = current.inventario
                .filter((item): item is InventoryItem & PocionType =>
                    item.type === 'utility' && item.type_utility === 'poción' && item.cantidad > 0)
                .map(potion => ({
                    potion,
                    amount: potion.potionType === 'reserve'
                        ? (potion.resource.includes(resource)
                            ? Math.min(current.stats.general[resource].max - current.stats.general[resource].actual, potion.reserve.actual)
                            : 0)
                        : potion.effect.filter(effect => effect.resource === resource && effect.amount > 0)
                            .reduce((total, effect) => total + effect.amount, 0),
                }))
                .filter(candidate => candidate.amount > 0)
                .sort((a, b) => a.amount - b.amount);

            for (const { potion, amount } of candidates) {
                if (current.stats.general[resource].actual >= current.stats.general[resource].max) break;
                if (potion.potionType === 'reserve') {
                    const result = this.applyReservePotion(current, { itemId: potion.id }, resource);
                    current = result.character;
                    for (const change of result.response.updatedItems) changes.set(change.id, change);
                    if (result.response.updatedPotion) reserves.set(potion.id, result.response.updatedPotion);
                    else reserves.delete(potion.id);
                } else {
                    const pool = current.stats.general[resource];
                    const quantity = Math.min(potion.cantidad, Math.ceil((pool.max - pool.actual) / amount));
                    const result = this.usePotion(current, { itemId: potion.id, quantity });
                    current = result.character;
                    for (const change of result.response.updatedItems) changes.set(change.id, change);
                }
            }
        }
        return {
            character: current,
            response: {
                hp: current.stats.general.hp.actual,
                mana: current.stats.general.mana.actual,
                updatedItems: [...changes.values()],
                updatedPotions: [...reserves.values()],
            },
        };
    }

    /** Descuenta los recursos restaurados de la reserva común, en el orden de resource. */
    useReservePotion(character: CharacterPersistence, request: UseReservePotionRequest): CharacterReservePotionUseResult {
        return this.applyReservePotion(character, request);
    }

    private applyReservePotion(
        character: CharacterPersistence,
        request: UseReservePotionRequest,
        priorityResource?: ReservePotion['resource'][number],
    ): CharacterReservePotionUseResult {
        const { itemId } = request;
        if (typeof itemId !== 'string' || !itemId.trim()) {
            throw new BadRequestException('El ID de la poción es obligatorio');
        }
        const source = structuredClone(character);
        const potion = source.inventario.find(item => item.id === itemId);
        if (!potion) throw new NotFoundException('No se encuentra la poción en el inventario');
        if (potion.type !== 'utility' || potion.type_utility !== 'poción') {
            throw new BadRequestException('El item seleccionado no es una poción');
        }
        if (potion.potionType !== 'reserve') {
            throw new BadRequestException('El item seleccionado no es una poción con reserva');
        }
        this.assertReserve(potion.reserve);
        if (potion.cantidad !== 1) {
            throw new BadRequestException('Las pociones con reserva deben utilizarse como instancias individuales');
        }
        if (!Array.isArray(potion.resource) || potion.resource.length === 0 ||
            potion.resource.some(resource => resource !== 'hp' && resource !== 'mana') ||
            new Set(potion.resource).size !== potion.resource.length) {
            throw new BadRequestException('La poción debe recuperar hp y/o mana, sin repetidos');
        }
        for (const resource of ['hp', 'mana'] as const) {
            const pool = source.stats.general[resource];
            if (!Number.isFinite(pool.actual) || !Number.isFinite(pool.max) ||
                pool.actual < 0 || pool.max < 0 || pool.actual > pool.max) {
                throw new BadRequestException('Los recursos actuales deben estar entre cero y su máximo');
            }
        }
        const resources = priorityResource && potion.resource.includes(priorityResource)
            ? [priorityResource, ...potion.resource.filter(resource => resource !== priorityResource)]
            : potion.resource;
        for (const resource of resources) {
            const pool = source.stats.general[resource];
            const restored = Math.min(pool.max - pool.actual, potion.reserve.actual);
            pool.actual += restored;
            potion.reserve.actual = Math.max(0, potion.reserve.actual - restored);
        }

        const entity = this.characterMapper.toDomain(source);
        const exhausted = potion.reserve.actual === 0;
        const updatedItems: InventoryChangeResult[] = exhausted
            ? entity.consumeItemsFromInventory([{ id: potion.id, idItem: potion.idItem, cantidad: 1 }])
            : [];
        const updated = this.characterMapper.toPersistence(entity);
        return {
            character: updated,
            response: {
                hp: updated.stats.general.hp.actual,
                mana: updated.stats.general.mana.actual,
                updatedPotion: exhausted ? null : { id: potion.id, resource: structuredClone(potion.resource), reserve: structuredClone(potion.reserve) },
                updatedItems,
            },
        };
    }

    /** Consume exactamente las unidades solicitadas, incluso si parte de la recuperación excede el máximo. */
    usePotion(character: CharacterPersistence, request: UsePotionRequest): CharacterPotionUseResult {
        const { itemId, quantity } = request;
        if (typeof itemId !== 'string' || !itemId.trim()) {
            throw new BadRequestException('El ID de la poción es obligatorio');
        }
        if (!Number.isSafeInteger(quantity) || quantity <= 0) {
            throw new BadRequestException('La cantidad debe ser un entero positivo válido');
        }

        const source = structuredClone(character);
        const potion = source.inventario.find(item => item.id === itemId);
        if (!potion) throw new NotFoundException('No se encuentra la poción en el inventario');
        if (potion.type !== 'utility' || potion.type_utility !== 'poción') {
            throw new BadRequestException('El item seleccionado no es una poción');
        }
        if (potion.potionType !== 'normal') {
            throw new BadRequestException('Esta operación solo admite pociones normales');
        }
        if (!Number.isSafeInteger(potion.cantidad) || potion.cantidad < quantity) {
            throw new BadRequestException('No hay suficientes unidades de la poción');
        }
        if (!Array.isArray(potion.effect) || potion.effect.length === 0) {
            throw new BadRequestException('La poción no tiene efectos de recuperación');
        }

        const restoration = { hp: 0, mana: 0 };
        for (const effect of potion.effect) {
            if (!effect || (effect.resource !== 'hp' && effect.resource !== 'mana') ||
                !Number.isFinite(effect.amount) || effect.amount < 0) {
                throw new BadRequestException('La poción tiene un efecto de recuperación inválido');
            }
            restoration[effect.resource] += effect.amount * quantity;
        }
        for (const resource of ['hp', 'mana'] as const) {
            const pool = source.stats.general[resource];
            if (!Number.isFinite(pool.actual) || !Number.isFinite(pool.max) ||
                pool.actual < 0 || pool.max < 0 || !Number.isFinite(restoration[resource])) {
                throw new BadRequestException('Los valores de recuperación y recursos deben ser finitos y no negativos');
            }
            pool.actual = Math.min(pool.max, pool.actual + restoration[resource]);
        }

        const entity = this.characterMapper.toDomain(source);
        const updatedItems = entity.consumeItemsFromInventory([{ id: potion.id, idItem: potion.idItem, cantidad: quantity }]);
        const updated = this.characterMapper.toPersistence(entity);
        return {
            character: updated,
            response: {
                hp: updated.stats.general.hp.actual,
                mana: updated.stats.general.mana.actual,
                updatedItems,
            },
        };
    }
    private assertReserve(reserve: PotionReserve): void {
        if (!reserve || !Number.isFinite(reserve.max) || !Number.isFinite(reserve.actual) ||
            reserve.max < 0 || reserve.actual < 0 || reserve.actual > reserve.max) {
            throw new BadRequestException('La reserva debe tener valores finitos y un saldo entre cero y su máximo');
        }
    }
}
