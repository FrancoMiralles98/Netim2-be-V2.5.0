import { SkillDamage } from "netim2-shared";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";
import { PreparedSkillDamage } from "../damage-calculator.types";
import { TurnContext } from "../../types/fight/fight-context.types";

export interface SkillHitResolverInput {
    attacker: FighterCombatEntity;

    target: FighterCombatEntity;
    skill: SkillDamage;

    hitIndex: number;
    context:TurnContext,
    preparedDamage: PreparedSkillDamage;

    dmgMultiplierPerHit: number;

    skillDamageMultiplier: number;

    buffDamageMultiplier: number;

    contextualBonusDamageMultiplier: number
}