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

export interface HealingReductionEffectData {
    effectId: 'corta_curacion',
    type: 'healing_reduction';
    healReductionPorcent: number;
}

export interface PoisonEffectData {
    effectId: 'veneno';
    damagePerTick: number;
    type: 'periodic_damage'
    healReductionPorcent: number
}

export interface FireEffectData {
    effectId: 'incendio';
    damagePerTick: number;
    type: 'periodic_damage'
    extraDamagePerRefresh: number;
}

export interface BleedingEffectData {
    effectId: 'sangrado';
    damagePerTick: number;
    type: 'periodic_damage'
    extraDamagePerMovementSpeed: number;
}

export interface ElectricEffectData {
    effectId: 'electrico';
    damagePerTick: number;
    type: 'periodic_damage'
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