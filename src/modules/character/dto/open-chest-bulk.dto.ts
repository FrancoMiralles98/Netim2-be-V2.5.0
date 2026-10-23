import { IsInt, IsNotEmpty, IsString, Matches, Max, Min } from 'class-validator';
import type { OpenChestBulkRequest } from 'netim2-shared';

export class OpenChestBulkDto implements OpenChestBulkRequest {
    @IsString()
    @IsNotEmpty()
    @Matches(/\S/)
    itemId!: OpenChestBulkRequest['itemId'];

    @IsInt()
    @Min(1)
    @Max(Number.MAX_SAFE_INTEGER)
    quantity!: number;
}
