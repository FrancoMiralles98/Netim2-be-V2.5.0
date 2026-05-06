import { BonusRefKeys } from "./bonusListHelper/ref-bonus-name.type";

export type SpecialBonus = Extract<BonusRefKeys,'media' | 'habilidad'>

export type MediaHabilidadRollConfigType = Record<SpecialBonus,TierConfigs[]>

export interface TierConfigs{
    tier: number;
    probability: number;
    minValue: number;
    maxValue: number;
}

