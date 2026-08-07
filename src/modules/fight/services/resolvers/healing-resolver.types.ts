import { FighterCombatEntity } from "../../entities/fighter-combat.entity";
import { HealingReductionResult } from "../../types/fighter/healing-reduction.types";

export type HealingSource =
    | 'skill'
    | 'regeneration'
    | 'robo_vida'
    | 'vampirismo_hechizo';

export interface HealingResolution {
    source: HealingSource;

    baseAmount: number;
    amountBeforeReduction: number;

    reductions: HealingReductionAppliedDetail[];
    totalReductionPercentage: number;
    preventedAmount: number;

    amountAfterReduction: number;

    effectiveHealing: number;
    overhealing: number;

    hpBefore: number;
    hpAfter: number;
}

export interface HealingReductionAppliedDetail {
    effectId: 'veneno' | 'corta_curacion';

    sourceFighterId: string;
    effectInstanceId: string;

    reductionPercent: number;

    /**
     * Cantidad de curación que este efecto evitó.
     */
    preventedAmount: number;
}

export interface ResolveHealingInput {
    healer: FighterCombatEntity;
    source: HealingSource;
    baseAmount: number;

}