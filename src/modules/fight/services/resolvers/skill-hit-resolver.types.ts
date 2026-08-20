import { SkillDamage } from "netim2-shared";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";
import { PreparedSkillDamage } from "../damage-calculator.types";

export interface SkillHitResolverInput {
    attacker: FighterCombatEntity;

    target: FighterCombatEntity;
    skill: SkillDamage;

    hitIndex: number;

    preparedDamage: PreparedSkillDamage;

    dmgMultiplierPerHit: number;

    skillDamageMultiplier: number;

    buffDamageMultiplier: number;

    contextualBonusDamageMultiplier: number
}