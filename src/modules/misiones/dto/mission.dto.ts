import { IsEnum, IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { IdMissionsList } from 'netim2-shared';
import type { AcceptMissionRequest, MissionAttemptRequest } from '../types/mission-api.types';

export class AcceptMissionDto implements AcceptMissionRequest {
    @IsInt()
    @IsEnum(IdMissionsList)
    missionId!: IdMissionsList;
}

export class MissionAttemptDto extends AcceptMissionDto implements MissionAttemptRequest {
    @IsString()
    @IsNotEmpty()
    @MaxLength(64)
    attemptId!: string;
}
