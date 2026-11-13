import type { GetSkillUpgradePreviewRequest, InventoryChangeResult, SkillType } from 'netim2-shared';

export type UpgradeCharacterSkillRequest = GetSkillUpgradePreviewRequest;

export type UpgradeCharacterSkillResponse = {
    skill: SkillType;
    puntos_habilidad: number;
    updatedItems: InventoryChangeResult[];
};
