import { DamageType, StatusEffectsKeys, UNIQUE_ID_SKILLS } from "netim2-shared";
import { DamageDelivery } from "./damage-statistics.types";
import { ResourceStatistics } from "./resource-statistics.types";
import { EffectStatistics } from "./effects-statistics.types";
import { ActiveStatusEffectId } from "../statusEffects/active-status-effect.types";

export type RegisteredDamageSource =
    | {
        type: 'basic_attack';
    }
    | {
        type: 'skill';
        skillId: UNIQUE_ID_SKILLS;
    }
    | {
        type: 'status_effect';
        effectId: ActiveStatusEffectId;
    }
    | {
        type: 'reflected';
    };

export interface RegisterDamageDealtInput {
    amount: number;

    damageType: DamageType;
    delivery: DamageDelivery;

    source: RegisteredDamageSource;
}

export interface RegisterDamageMitigatedInput {
    amount: number;
    damageType?: DamageType;

    /**
     * Se informa únicamente cuando el daño mitigado
     * provenía de un efecto de estado.
     */
    statusEffectId?: ActiveStatusEffectId;
}

export interface RegisterAttackHitsInput {
    hits: RegisterOffensiveHitInput[];
    doubleHitTriggered: boolean;
}

export interface RegisterOffensiveHitInput {
    result: OffensiveHitResult;
    critical?: boolean;
    penetrating?: boolean;
}

export type OffensiveHitResult =
    | 'successful'
    | 'missed'


export type RegisterDefensiveHitInput =
    | {
        result: 'received';
    }
    | {
        result: 'dodged';
    }
    | {
        result: 'blocked';
        blockType: 'full' | 'partial';
    };

export type RegisterHealingInput = GenericHealingInput | SkillHealingInput 

export interface GenericHealingInput {
    type: 'regeneration' | 'prevented' | 'basic_attack'
    amount: number
}

export interface SkillHealingInput {
    type: 'skill'
    idSkill: UNIQUE_ID_SKILLS
    amount: number
}

export type RegisterResourceInput = Partial<ResourceStatistics>;

export type RegisterEffectsInput = Partial<EffectStatistics>;