import { DamageTag, DamageType, SkillDamage, SkillDamageFlags, UNIQUE_ID_SKILLS } from "netim2-shared";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";

export interface ResolveDamageInput {
    attacker: FighterCombatEntity;

    target: FighterCombatEntity;

    amount: number;

    damageType: DamageType;

    tags: readonly DamageTag[];

    flags?: SkillDamageFlags;

    delivery:
    | 'direct'
    | 'periodic'
    | 'reflected';

    skill?: SkillDamage;
}

export interface DamageResolutionResult {
    requestedDamage: number;

    mitigatedAmount: number;

    damageAfterMitigation: number;

    effectiveDamage: number;

    overkillDamage: number;

    hpBefore: number;
    hpAfter: number;
}