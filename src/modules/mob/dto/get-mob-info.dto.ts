import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import type { GetMobInfoRequest, IdMobList } from 'netim2-shared';

export class GetMobInfoDto implements GetMobInfoRequest {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(Number.MAX_SAFE_INTEGER)
    idMob!: IdMobList;
}
