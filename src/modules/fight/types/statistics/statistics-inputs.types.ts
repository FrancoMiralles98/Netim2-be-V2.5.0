import { DamageType, StatusEffectsKeys, UNIQUE_ID_SKILLS } from "netim2-shared";
import { DamageDelivery } from "./damage-statistics.types";
import { HealingStatistics } from "./healing-statistics.types";
import { ResourceStatistics } from "./resource-statistics.types";
import { EffectStatistics } from "./effects-statistics.types";

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
        effectId: StatusEffectsKeys;
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
    damageType: DamageType;

    /**
     * Se informa únicamente cuando el daño mitigado
     * provenía de un efecto de estado.
     */
    statusEffectId?: StatusEffectsKeys;
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
    | 'dodged_by_target';


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

export type RegisterHealingInput = Partial<HealingStatistics>

export type RegisterResourceInput = Partial<ResourceStatistics>;

export type RegisterEffectsInput = Partial<EffectStatistics>;