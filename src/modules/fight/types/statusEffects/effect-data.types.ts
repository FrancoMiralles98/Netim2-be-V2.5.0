export type ActiveStatusEffectData =
    | PoisonEffectData
    | FireEffectData
    | BleedingEffectData
    | RetardoEffectData
    | ElectricEffectData
    | DesmayoEffectData
    | HealingReductionEffectData

export type PeriodicDamageEffectData =
    | PoisonEffectData
    | FireEffectData
    | BleedingEffectData
    | ElectricEffectData;

export interface basePeriodicDamageEffectData {
    type: 'periodic_damage';
    damagePerTick: number;
    refreshOptions?: {
        refreshExtraBonusDamageAvailable: boolean;
        refreshExtraBonusRatio: number;
    }
}

export interface HealingReductionEffectData {
    effectId: 'corta_curacion',
    type: 'healing_reduction';
    healReductionPorcent: number;
}

export interface PoisonEffectData extends basePeriodicDamageEffectData {
    effectId: 'veneno';
    healReductionPorcent: number
}

export interface FireEffectData extends basePeriodicDamageEffectData {
    effectId: 'incendio';
}

export interface BleedingEffectData extends basePeriodicDamageEffectData {
    effectId: 'sangrado';
    extraDamagePerMovementSpeed: number;
}

export interface ElectricEffectData extends basePeriodicDamageEffectData {
    effectId: 'electrico';
    extraDamageToApplyStacks: number;
}

export interface RetardoEffectData {
    type: 'stat_modifier'
    effectId: 'retardo';
}

export interface DesmayoEffectData {
    type: 'control',
    effectId: 'desmayo';
}


export function isPeriodicDamageEffectData(
    data: ActiveStatusEffectData
): data is PeriodicDamageEffectData {
    switch (data.type) {
        case 'periodic_damage':
            return true;

        case 'control':
        case 'stat_modifier':
        case 'healing_reduction':
            return false;
    }
}