export type ActiveStatusEffectData =
    | PoisonEffectData
    | FireEffectData
    | BleedingEffectData
    | SlowEffectData
    | ElectricEffectData
    | StunEffectData

export interface PoisonEffectData {
    type: 'veneno';
    damagePerTick: number;
    healReduction: number
}

export interface FireEffectData {
    type: 'incendio';
    damagePerTick: number;
    extraDamagePerRefresh: number;
}

export interface BleedingEffectData {
    type: 'sangrado';
    damagePerTick: number;
    extraDamagePerMovementSpeed: number;
}

export interface ElectricEffectData {
    type: 'electrico';
    damagePerTick: number;
    extraDamageToApplyStacks: number;
}

export interface SlowEffectData {
    type: 'retardo';
    VA_Reduction: number; //velocidad de ataque reducido (%)
    MV_Reduction: number; //velocidad de movimiento reducido (%)
    VH_Reduction: number; //velocidad de hechizo reducido (%)
}

export interface StunEffectData {
    type: 'desmayo';
}
