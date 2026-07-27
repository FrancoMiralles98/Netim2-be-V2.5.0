export type ActiveStatusEffectData =
    | PoisonEffectData
    | FireEffectData
    | BleedingEffectData
    | SlowEffectData
    | ElectricEffectData
    | StunEffectData
    | HealingReductionEffectData

export interface PoisonEffectData {
    type: 'veneno';
    damagePerTick: number;
}

export interface FireEffectData {
    type: 'incendio';
    damagePerTick: number;
    extraBaseDamagePercentage: number;
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

//Cuando se aplica veneno se tiene que generar otra entidad que añada este efecto de reduccion de curaciones
export interface HealingReductionEffectData {
    type: 'healing_reduction';
    reductionPercentage: number;
}