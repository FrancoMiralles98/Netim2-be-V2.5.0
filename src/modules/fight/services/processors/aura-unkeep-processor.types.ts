export interface AuraUpkeepResult {
    maintainedAuraIds: string[];
    deactivatedAuraIds: string[];
    manaSpent: number;
}