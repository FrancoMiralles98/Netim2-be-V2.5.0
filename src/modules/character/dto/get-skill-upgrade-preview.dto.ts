import { IsEnum, IsInt } from 'class-validator';
import { UNIQUE_ID_SKILLS } from 'netim2-shared';
import type { GetSkillUpgradePreviewRequest } from 'netim2-shared';

export class GetSkillUpgradePreviewDto implements GetSkillUpgradePreviewRequest {
    @IsInt()
    @IsEnum(UNIQUE_ID_SKILLS)
    skillId!: GetSkillUpgradePreviewRequest['skillId'];
}
