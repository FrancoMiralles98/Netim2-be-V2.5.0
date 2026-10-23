import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import type { UsePotionRequest } from 'netim2-shared';

export class UsePotionDto implements UsePotionRequest {
    @IsString()
    @IsNotEmpty()
    itemId!: UsePotionRequest['itemId'];

    @IsInt()
    @Min(1)
    @Max(Number.MAX_SAFE_INTEGER)
    quantity!: number;
}
