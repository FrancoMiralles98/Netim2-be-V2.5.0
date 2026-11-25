import { ArrayNotEmpty, ArrayUnique, IsArray, IsMongoId, IsString, Matches } from 'class-validator';
import type { ClaimHistoryRewardsRequest } from 'netim2-shared';

export class ClaimHistoryRewardsDto implements ClaimHistoryRewardsRequest {
    @IsMongoId()
    historialId: string;

    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsString({ each: true })
    @Matches(/\S/, { each: true })
    rewardIds: string[];
}

export class CharacterHistoryParamsDto {
    @IsMongoId()
    id: string;
}
