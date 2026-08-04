import { DamageType, SkillDamage, StatusEffectsKeys } from "netim2-shared";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";
import { ActiveStatusEffectEntity } from "../../entities/active-status-effect.entity";

export type ResolveDmgMitigationInput =
    | ResolveBasicAttackMitigationInput
    | ResolveSkillMitigationInput
    | ResolveStatusEffectMitigationInput
    | ResolveReflectedMitigationInput;

export interface ResolveDmgMitigationBaseInput {
    attacker: FighterCombatEntity;
    target: FighterCombatEntity;

    damage: number;
    damageType: DamageType;
}

export interface ResolveBasicAttackMitigationInput
    extends ResolveDmgMitigationBaseInput {
    sourceType: 'basic_attack';

}

export interface ResolveSkillMitigationInput
    extends ResolveDmgMitigationBaseInput {
    sourceType: 'skill';

    skill: SkillDamage;
}

export interface ResolveStatusEffectMitigationInput
    extends ResolveDmgMitigationBaseInput {
    sourceType: 'status_effect';

    effect: ActiveStatusEffectEntity;
}

export interface ResolveReflectedMitigationInput
    extends ResolveDmgMitigationBaseInput {
    sourceType: 'reflected';

    reflectedFromDamageType: DamageType;
}


export interface DmgMitigationResult {
    requestedDamage: number;

    damageType?: DamageType;

    rawBonusDefensePercent: number;
    effectiveBonusDefensePercent: number;

    mitigatedAmount: number;
    damageAfterMitigation: number;

    fullyMitigated: boolean;
}