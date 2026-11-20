import { IsEnum, IsInt, IsMongoId, Max, Min } from 'class-validator';
import { IdMob } from 'netim2-shared';
import type { FightCharacterMobRequest } from 'netim2-shared';

export class FightCharacterMobDto implements FightCharacterMobRequest {
    @IsInt()
    @IsEnum(IdMob)
    idMob!: FightCharacterMobRequest['idMob'];

    @IsInt()
    @Min(1)
    @Max(Number.MAX_SAFE_INTEGER)
    quantity!: FightCharacterMobRequest['quantity'];
}

export class FightCharacterParamsDto {
    @IsMongoId()
    id!: string;
}
