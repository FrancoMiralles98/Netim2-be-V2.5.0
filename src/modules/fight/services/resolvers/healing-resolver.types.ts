import { FightEntity } from "../../entities/fight.entity";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";

export type HealingSource =
    | 'skill'
    | 'regeneration'
    | 'robo_vida'
    | 'vampirismo_hechizo';

export interface HealingReductionDetail {
    type: 'corta_cura' | 'veneno';
    percentage: number;
    sourceFighterId?: string;
}

export interface HealingResolution {
    source: HealingSource;

    baseAmount: number;
    amountBeforeReduction: number;

    reductions: HealingReductionDetail[];
    totalReductionPercentage: number;
    preventedAmount: number;

    amountAfterReduction: number;

    effectiveHealing: number;
    overhealing: number;

    hpBefore: number;
    hpAfter: number;
}

export type HealingReductionSource =
    | {
        type: 'healing_cut';
        sourceFighterId: string;
        percentage: number;
    }
    | {
        type: 'poison';
        effectInstanceId: string;
        sourceFighterId?: string;
        percentage: number;
    };

export interface ResolveHealingInput {
    healer: FighterCombatEntity;
    opponent: FighterCombatEntity;
    source: HealingSource;
    baseAmount: number;

}