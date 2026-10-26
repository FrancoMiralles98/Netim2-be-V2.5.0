import { ArrayUnique, IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import type { OpenChestRequest } from 'netim2-shared';

export class OpenChestDto implements OpenChestRequest {
    @IsString()
    @IsNotEmpty()
    @Matches(/\S/)
    itemId!: OpenChestRequest['itemId'];

    @IsOptional()
    @IsArray()
    @ArrayUnique()
    @IsInt({ each: true })
    selectedItemIds?: OpenChestRequest['selectedItemIds'];
}
