import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import type { IdItemList, InventoryItem, MissionReward, MissionRewardDetail } from 'netim2-shared';
import { ItemService } from '../../item/item.service';
import type { CharacterEntity } from '../../character/entity/character-entity';


type ItemReward = Extract<MissionReward, { type: 'item' }>;

/** Prepara recompensas de catálogo y las aplica a una entidad de trabajo. */
@Injectable()
export class MissionRewardService {
    constructor(private readonly items: ItemService) {}

    /** Resuelve los datos completos de cada ítem, incluida su mejora. */
    describe(rewards: readonly MissionReward[]): MissionRewardDetail[] {
        return rewards.map(reward => {
            if (reward.type !== 'item') {
                this.assertAmount(reward.amount, 0);
                return reward;
            }
            const item = this.prepareItem(reward);
            if (item.type === 'utility') item.cantidad = reward.quantity;
            return { ...reward, item };
        });
    }

    /** Consume los objetivos de entrega sobre una copia del personaje. */
    consume(entity: CharacterEntity, inventory: InventoryItem[], deliveries: Map<IdItemList, number>): void {
        for (const [idItem, quantity] of deliveries) {
            const matching = inventory.filter(item => item.idItem === idItem);
            if (matching[0]?.type === 'utility') {
                entity.consumeItemsFromInventory([{ idItem, cantidad: quantity }]);
            } else {
                entity.consumeItemsFromInventory(matching.slice(0, quantity).map(item => ({ idItem, id: item.id })));
            }
        }
    }

    /** Inserta todos los ítems y aplica los recursos; la copia se descarta ante cualquier error. */
    grant(entity: CharacterEntity, rewards: readonly MissionReward[], currentYang: number): void {
        let exp = 0;
        let yang = 0;
        for (const reward of this.describe(rewards)) {
            if (reward.type === 'exp') exp += reward.amount;
            else if (reward.type === 'yang') yang += reward.amount;
            else {
                const item = reward.item;
                const stackable = item.type === 'utility' && item.acc &&
                    !(item.type_utility === 'poción' && item.potionType === 'reserve');
                try {
                    if (stackable) {
                        entity.addItemToInventory(item);
                    } else {
                        if (item.type === 'utility') item.cantidad = 1;
                        for (let unit = 0; unit < reward.quantity; unit++) {
                            entity.addItemToInventory(structuredClone(item));
                        }
                    }
                } catch {
                    throw new BadRequestException('No hay espacio suficiente para todas las recompensas');
                }
            }
        }
        this.assertAmount(exp, 0);
        this.assertAmount(currentYang + yang, 0);
        if (yang > 0) entity.addYang(yang);
        if (exp > 0) entity.gainExp(exp);
    }

    /** Valida cantidad y mejora usando la resolución del catálogo de ítems. */
    private prepareItem(reward: ItemReward) {
        this.assertAmount(reward.quantity, 1);
        const [item] = this.items.getItems({
            items: [{ idItem: reward.itemId, upgradeLv: reward.upgradeLv }],
        });
        if (item.type === 'utility') this.assertAmount(item.maxCantidad, 1);
        return item;
    }

    /** Valida valores configurados antes de conceder recursos. */
    private assertAmount(amount: number, minimum: number): void {
        if (!Number.isSafeInteger(amount) || amount < minimum) {
            throw new InternalServerErrorException('Cantidad de recompensa inválida');
        }
    }
}
