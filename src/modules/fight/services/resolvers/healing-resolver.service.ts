import { Injectable } from "@nestjs/common";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";
import { HealingReductionDetail, HealingResolution, ResolveHealingInput } from "./healing-resolver.types";
import { RngService } from "src/modules/shared/services/rng.service";
import { BONUS_EFFECTS_CONFIG } from "../../config/bonus-effects.config";

@Injectable()
export class HealingResolverService {
    constructor(
        private rngService: RngService
    ) { }

    resolve(
        { healer, opponent, source, baseAmount }: ResolveHealingInput
    ): HealingResolution {
        const amountBeforeReduction = this.normalizeAmount(baseAmount)
        const reductionsDetails = this.getHealingReductionDetails(healer, opponent)
        const reductionsPorcentage = Math.min(1, reductionsDetails.reduce((total, reduction) =>
            total + reduction.percentage, 0));

        const preventedAmount = Math.floor(amountBeforeReduction * reductionsPorcentage)
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
            reductions: reductionsDetails,
            source,
            totalReductionPercentage: reductionsPorcentage
        }
    }

    private getHealingReductionDetails(
        healer: FighterCombatEntity,
        target: FighterCombatEntity
    ): HealingReductionDetail[] {

        let reductions: HealingReductionDetail[] = []
        const venenoEffect = healer.findActiveStatusEffect('veneno') //veneno aplica reducion de curaciones
        if (venenoEffect && venenoEffect.Effectdata.type === 'veneno') {
            reductions.push({
                percentage: venenoEffect.Effectdata.healReduction,
                type: 'veneno',
            })
        }

        const targetCortaCuras = target.baseStats.bonus.defensa.corta_curacion

        if (this.rngService.randomNumberInRange(targetCortaCuras)) {
            reductions.push({
                percentage: BONUS_EFFECTS_CONFIG.corta_curacion,
                type: 'corta_cura',
                sourceFighterId: target.id
            })
        }

        return reductions
    }

    private normalizeAmount(amount: number): number {
        if (!Number.isFinite(amount)) {
            throw new Error('Healing amount must be finite.');
        }

        return Math.max(0, Math.floor(amount));
    }
}