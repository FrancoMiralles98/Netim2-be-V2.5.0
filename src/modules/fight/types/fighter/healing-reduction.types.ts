export interface HealingReductionSource {
    effectId: 'veneno' | 'corta_curacion';

    sourceFighterId: string;
    effectInstanceId: string;

    reductionPercent: number;
}

export interface HealingReductionResult {
    totalReductionPercent: number;

    sources: HealingReductionSource[];
}