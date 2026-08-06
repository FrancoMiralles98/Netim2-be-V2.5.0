import { DurationConfig, StatsModifiers, StatusEffectsKeys } from "netim2-shared";
import { ActiveStatusEffectData } from "../statusEffects/effect-data.types";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";

export interface ApplyStatusEffectInput {
    source: FighterCombatEntity;
    target: FighterCombatEntity;

    effectId: StatusEffectsKeys;
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