import { ChestType, Reward } from "../types/entities-props/chest.type";
import { UtilityBase } from "./utility-base.entity";

export class Chest extends UtilityBase {
    constructor(protected props: ChestType) {
        super(props)
    }

    /**
     * Abre el cofre y devuelve las recompensas obtenidas según su configuración.
     *
     * - `random`: devuelve una sola recompensa elegida por weight.
     * - `all`: devuelve todas las recompensas configuradas.
     */
    open(): Reward[] {
        switch (this.props.rewardConfig) {
            case 'random':
                return [this.getRandomRewardByWeight()]

            case 'all':
                return [...this.props.rewards]

            default:
                throw new Error(`Reward config inválida`)
        }
    }

    /**
     * Selecciona una recompensa aleatoria usando su propiedad `weight`.
     */
    private getRandomRewardByWeight(): Reward {
        const totalWeight = this.props.rewards.reduce(
            (total, reward) => total + reward.weight,
            0
        )

        if (totalWeight <= 0) {
            throw new Error(`El cofre no tiene rewards con weight válido`)
        }

        let randomWeight = Math.random() * totalWeight

        for (const reward of this.props.rewards) {
            randomWeight -= reward.weight

            if (randomWeight <= 0) {
                return reward
            }
        }

        throw new Error(`No se pudo seleccionar reward del cofre`)
    }
}