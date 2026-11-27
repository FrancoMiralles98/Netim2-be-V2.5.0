import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { MAX_EQUIPMENT_FORGE_DURABILITY } from '../../../item/config/equipment-forge.config';
import { FORGE_YANG_COST_CONFIG } from '../config/forge-yang-cost.config';
import type { ForgeOutcomeChances, ForgeAttemptModifierConfig, ForgeTargetUpgradeLv, ForgeUpgradeLv } from 'netim2-shared';

/** Calcula costes y resultados posibles sin ejecutar una mejora. */
@Injectable()
export class ForgeCalculationService {
    /** Aplica costes enteros sin cobrar fracciones; admite descuentos y coste cero. */
    scaleResourceCost(amount: number, multiplier = 1): number {
        const result = Math.ceil(amount * multiplier);
        if (!Number.isSafeInteger(amount) || amount < 0 || !Number.isFinite(multiplier) || multiplier < 0
            || !Number.isSafeInteger(result) || result < 0) {
            throw new InternalServerErrorException('Multiplicador o coste de mejora inválido');
        }
        return result;
    }

    /** Calcula el descenso desde el nivel actual; la protección conserva la durabilidad. */
    getUpgradeLvAfterProtectedFailure(current: ForgeUpgradeLv, modifier?: ForgeAttemptModifierConfig): ForgeUpgradeLv {
        if (!Number.isInteger(current) || current < 0 || current > 9) {
            throw new BadRequestException('Nivel de mejora actual inválido');
        }
        const loss = modifier?.upgradeLvLossOnProtectedFailure ?? 0;
        if (!Number.isSafeInteger(loss) || loss < 0 || (loss > 0 && !modifier?.preventDestruction)) {
            throw new InternalServerErrorException('Descenso por fallo protegido inválido');
        }
        return Math.max(0, current - loss) as ForgeUpgradeLv;
    }

    /** Aumenta el coste con el nivel requerido y el nivel de mejora de destino. */
    getYangCost(lvReq: number, target: ForgeTargetUpgradeLv): number {
        const config = FORGE_YANG_COST_CONFIG;
        const cost = Math.ceil((config.base + lvReq * config.perRequiredLevel) * config.upgradeMultipliers[target]);
        if (!Number.isSafeInteger(lvReq) || lvReq < 0 || !Number.isSafeInteger(cost) || cost < 0) {
            throw new InternalServerErrorException('Configuración de coste de herrería inválida');
        }
        return cost;
    }

    /** Distribuye el fallo según la durabilidad; la protección evita todo desgaste. */
    getChances(base: number, durability: number, modifier?: ForgeAttemptModifierConfig): ForgeOutcomeChances {
        if (!Number.isInteger(durability) || durability < 0 || durability > MAX_EQUIPMENT_FORGE_DURABILITY) {
            throw new BadRequestException('Durabilidad de herrería inválida');
        }
        const bonus = modifier?.successChanceBonus ?? 0;
        if (!Number.isFinite(base) || base < 0 || base > 100 || !Number.isFinite(bonus) || bonus < 0) {
            throw new InternalServerErrorException('Modificador de probabilidad inválido');
        }
        const success = Math.min(100, base * (1 + bonus / 100));
        const failure = 100 - success;
        if (modifier?.preventDestruction) {
            return { success, destruction: 0, durabilityLoss: 0, protectedFailure: failure };
        }
        const durabilityLoss = failure * 0.5 * durability / MAX_EQUIPMENT_FORGE_DURABILITY;
        return { success, destruction: failure - durabilityLoss, durabilityLoss, protectedFailure: 0 };
    }
}
