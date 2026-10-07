import { BonusRefKeys, ChanceDamageModifier, ConditionalDamageModifier, DamageCondition, DamageTag, DamageType, LetterMasteryLv, MechanicsEffectsKeys, RoutStatKey, SkillCooldownConfig, SkillDamageFlags, StatusEffectsKeys, WeightedDamageModifier } from "netim2-shared";
import { EscaladoAtributos } from "../escalado-atributos-types";
import { SkillScalingLv } from "../escalado-lv.types";

export interface SkillDamageScaling {
    type: 'damage'
    cd: SkillCooldownConfig;
    mana: {
        base: number;
        perLv: number;
    },
    components: SkillDamageComponentScaling[]
    statusEffectScaling?: Partial<Record<StatusEffectsKeys, EffectsScaling>>
    mechanicsEffectScaling?: Partial<Record<MechanicsEffectsKeys, EffectsScaling>>
    hitModifiersScaling?: HitModifiersScaling;
    damageModifiersScaling?: DamageModifierSclaing
}

export interface SkillDamageComponentScaling {
    damageType: DamageType;

    tags: DamageTag[];

    escaladoMain: {
        min: number;
        max: number;
    };

    escaladoLv: SkillScalingLv;

    escaladoAtributos?: EscaladoAtributos

    statsScaling?: SkillDamageStatScaling[]

    flags?: SkillDamageFlags;
}


export interface SkillDamageStatScaling {
    stat: BonusRefKeys;
    base: number;
    perLv: number;
    target: RoutStatKey
}

export interface EffectsScaling {
    base: number;
    perLv: number;
}

export type HitModifiersScaling = ChanceMultiHitScaling | WeightedHitCountScaling


export interface ChanceMultiHitScaling {
    type: 'chance_multi_hit';
    chancesConfig: {
        base: number;
        per_lv: number
    };
    hitsConfig: {
        base: number;
        perLv: number;
    };
    damageMultiplierPerHitConfig: {
        base: number;
        perLv: number;
    }
}

export interface WeightedHitCountScaling {
    type: 'weighted_hit_count';
    optionsScaling: OptionsScaling[]
}

export interface OptionsScaling {
    unlockLv?: LetterMasteryLv,
    chancesConfig: {
        base: number;
        per_lv: number
    };
    hitsConfig: {
        base: number;
        perLv: number;
    };
    damageMultiplierPerHitConfig: {
        base: number;
        perLv: number;
    }
}

export type DamageModifierSclaing =
    ChanaceDamageModifierScaling |
    WeightedDamageModifierScaling |
    ConditionalDamageModifierScaling

export interface ChanaceDamageModifierScaling {
    type: ChanceDamageModifier['type']
    chanceConfig: {
        baseChance: number;
        perLv: number;
    },
    multiplier: {
        baseMultiplier: number;
        perLv: number;
    }
}

export interface WeightedDamageModifierScaling {
    type: WeightedDamageModifier['type']
    options: OptionsConfig[]
}

export interface OptionsConfig {
    unlockLv?: LetterMasteryLv,
    chanceConfig: {
        baseChance: number;
        perLv: number;
    },
    multiplier: {
        baseMultiplier: number;
        perLv: number;
    }
}

export interface ConditionalDamageModifierScaling {
    condition: DamageCondition;
    type: ConditionalDamageModifier['type']
    multiplier: {
        baseMultiplier: number;
        perLv: number;
    }
}


