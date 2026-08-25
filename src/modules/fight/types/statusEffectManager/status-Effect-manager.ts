import { DurationConfig, StatsModifiers } from "netim2-shared";
import { ActiveStatusEffectData } from "../statusEffects/effect-data.types";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";
import { ActiveStatusEffectId } from "../statusEffects/active-status-effect.types";

export interface ApplyStatusEffectInput {
    source: FighterCombatEntity;
    target: FighterCombatEntity;

    effectId: ActiveStatusEffectId;
    canStackDuration: boolean;
    appliedOnTurn: number;

    duration: DurationConfig;

    data: ActiveStatusEffectData;

    modifiers: readonly StatsModifiers[];

    stacks?: {
        initial: number;
        max: number;
        toApplyExtraDamage: number;
    };
}