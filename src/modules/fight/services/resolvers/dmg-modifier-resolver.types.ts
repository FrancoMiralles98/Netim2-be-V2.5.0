import { SkillDamageModifier } from "netim2-shared";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";

export interface SkillDamageModifierResolution {
    multiplier: number;

    applied: boolean;

    modifierType?: SkillDamageModifier['type'];

    description?: string;
}

export interface ResolveSkillDamageModifierInput {
    modifier: SkillDamageModifier | undefined;

    source: FighterCombatEntity;
    target: FighterCombatEntity;
}