import { ActionStatistics } from "./action-statistics.types";
import { DamageStatistics } from "./damage-statistics.types";
import { EffectStatistics } from "./effects-statistics.types";
import { HealingStatistics } from "./healing-statistics.types";
import { HitStatistics } from "./hit-statistics.types";
import { ResourceStatistics } from "./resource-statistics.types";

export interface FighterCombatStatisticsState {
    damage: DamageStatistics;
    healing: HealingStatistics;
    resources: ResourceStatistics;
    actions: ActionStatistics;
    hits: HitStatistics;
    effects: EffectStatistics;
}

