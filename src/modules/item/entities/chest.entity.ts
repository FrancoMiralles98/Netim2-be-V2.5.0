import type { IdItemList } from 'netim2-shared';
import { BadRequestException } from '@nestjs/common';
import { RngService } from '../../shared/services/rng.service';
import type { ChestType, Reward } from 'netim2-shared';
import { UtilityBase } from './utility-base.entity';

export class Chest extends UtilityBase {
    constructor(protected props: ChestType, private readonly rng = new RngService()) { super(props); }

    /** Valida la selección sin sortear ni modificar el cofre. */
    getAvailableRewards(selectedItemIds?: IdItemList[]): Reward[] {
        const { rewards } = this.props;
        if (!Array.isArray(rewards) || rewards.length === 0) throw new BadRequestException('El cofre no tiene recompensas');
        if (this.props.rewardConfig === 'pick') {
            const count = this.props.pickCount;
            if (!Number.isSafeInteger(count) || count < 1 || count > rewards.length) {
                throw new BadRequestException('La cantidad de elecciones del cofre no es válida');
            }
            if (!Array.isArray(selectedItemIds) || selectedItemIds.length !== count || new Set(selectedItemIds).size !== count) {
                throw new BadRequestException('Debes seleccionar exactamente ' + count + ' recompensas distintas');
            }
            return structuredClone(selectedItemIds.map(id => {
                const matches = rewards.filter(reward => reward.type_reward === 'item' && reward.idItem === id);
                if (matches.length !== 1) throw new BadRequestException('La recompensa seleccionada no existe o su idItem es ambiguo');
                return matches[0];
            }));
        }
        if (selectedItemIds !== undefined) throw new BadRequestException('Este cofre no permite elegir recompensas');
        if (this.props.rewardConfig !== 'random' && this.props.rewardConfig !== 'all') throw new BadRequestException('Configuración de cofre inválida');
        if (this.props.rewardConfig === 'random' && (rewards.some(reward => !Number.isFinite(reward.weight) || reward.weight < 0) ||
            !Number.isFinite(rewards.reduce((total, reward) => total + reward.weight, 0)) || !rewards.some(reward => reward.weight > 0))) {
            throw new BadRequestException('Los pesos del cofre no son válidos');
        }
        return structuredClone(rewards);
    }

    open(selectedItemIds?: IdItemList[]): Reward[] {
        const rewards = this.getAvailableRewards(selectedItemIds);
        return this.props.rewardConfig === 'random' ? [this.rng.pickWeightedItem(rewards, reward => reward.weight)] : rewards;
    }
}
