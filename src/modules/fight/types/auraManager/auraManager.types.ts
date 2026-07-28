import { SkillAura, UNIQUE_ID_SKILLS } from "netim2-shared";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";
import { CombatStatKey, CombatStatModifierOperation } from "../activeAura/active-aura.type";
import { ActiveAuraEntity } from "../../entities/active-aura.entity";

export interface ActivateAuraInput {
    source: FighterCombatEntity;
    skill: SkillAura;
    activatedOnTurn: number;
    modifiers: AuraStatModifierInput[];
}

export interface AuraStatModifierInput {
    target: CombatStatKey;
    operation: CombatStatModifierOperation;
    value: number;
}

export interface DeactivateAuraInput {
    owner: FighterCombatEntity;
    aura: ActiveAuraEntity;
}

export interface AuraDeactivationResult {
    auraInstanceId: string;
    skillId: UNIQUE_ID_SKILLS;
    deactivated: boolean;
}

export interface DeactivateAllOwnedAurasInput {
    owner: FighterCombatEntity;
}

export interface DeactivateAuraBySkillIdInput {
    owner: FighterCombatEntity;
    skillId: UNIQUE_ID_SKILLS;
}