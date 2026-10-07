import { BonusRefKeys } from "netim2-shared";

export type SpecialBonus = Extract<BonusRefKeys,'media' | 'habilidad'>

export type MediaHabilidadRollConfigType = Record<SpecialBonus,TierConfigs[]>

export interface TierConfigs{
    tier: number;
    probability: number;
    minValue: number;
    maxValue: number;
}

