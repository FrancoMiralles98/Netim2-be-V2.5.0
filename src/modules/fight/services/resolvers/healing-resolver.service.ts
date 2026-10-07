import { Injectable } from "@nestjs/common";
import { HealingReductionAppliedDetail, HealingResolution, ResolveHealingInput } from "./healing-resolver.types";
import { HealingReductionSource } from "../../types/fighter/healing-reduction.types";

@Injectable()
export class HealingResolverService {

    resolve({ healer, source, baseAmount }: ResolveHealingInput): HealingResolution {
        const amountBeforeReduction = this.normalizeAmount(baseAmount)
        const reductionsDetails = healer.getHealingReduction()
        const reductionsPorcentage = reductionsDetails.totalReductionPercent

        const preventedAmount = Math.floor(amountBeforeReduction * reductionsPorcentage)
        const reductions =
            this.resolveReductionDetails({
                amountBeforeReduction,
                totalReductionPercentage: reductionsPorcentage,
                preventedAmount,
                sources: reductionsDetails.sources
            });

        const amountAfterReduction = Math.max(0, amountBeforeReduction - preventedAmount);

        const applied = healer.heal(amountAfterReduction)

        return {
            amountAfterReduction,
            amountBeforeReduction,
            baseAmount,
            effectiveHealing: applied.effectiveHealing,
            hpAfter: applied.hpAfter,
            hpBefore: applied.hpBefore,
            overhealing: applied.overhealing,
            preventedAmount,
            reductions,
            source,
            totalReductionPercentage: reductionsPorcentage
        }
    }

    private resolveReductionDetails(input: {
        amountBeforeReduction: number;
        totalReductionPercentage: number;
        preventedAmount: number;
        sources: HealingReductionSource[];
    }): HealingReductionAppliedDetail[] {

        if (input.sources.length === 0 || input.preventedAmount === 0) {
            return [];
        }

        const rawTotalPercent = input.sources.reduce((total, source) =>
            total + source.reductionPercent, 0);

        if (rawTotalPercent <= 0) {
            return [];
        }

        /*
         * Distribuimos el preventedAmount real
         * proporcionalmente entre todos los efectos.
         *
         * Esto también funciona correctamente cuando
         * las reducciones superan el límite de 100%.
         */
        let distributedAmount = 0;

        return input.sources.map((reduction, index) => {

            /*
             * Al último efecto le asignamos
             * el resto para evitar diferencias
             * por redondeo.
             */
            const isLast = index === input.sources.length - 1;

            const preventedByEffect = isLast
                ? input.preventedAmount - distributedAmount
                : Math.floor(input.preventedAmount * (reduction.reductionPercent / rawTotalPercent));

            distributedAmount += preventedByEffect;

            return {
                effectId: reduction.effectId,

                sourceFighterId: reduction.sourceFighterId,

                effectInstanceId: reduction.effectInstanceId,

                reductionPercent: reduction.reductionPercent,

                preventedAmount: preventedByEffect
            };
        }
        );
    }

    private normalizeAmount(amount: number): number {
        if (!Number.isFinite(amount)) {
            throw new Error('Healing amount must be finite.');
        }

        return Math.max(0, Math.floor(amount));
    }
}