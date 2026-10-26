import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, Max, Min, ValidateNested } from 'class-validator';
import type { GetItemsRequest, ItemDetailsQuery } from 'netim2-shared';

export class ItemDetailsQueryDto implements ItemDetailsQuery {
    @IsInt()
    idItem!: ItemDetailsQuery['idItem'];

    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(Number.MAX_SAFE_INTEGER)
    upgradeLv?: ItemDetailsQuery['upgradeLv'];

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(Number.MAX_SAFE_INTEGER)
    quantity?: ItemDetailsQuery['quantity'];
}

export class GetItemsDto implements GetItemsRequest {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ItemDetailsQueryDto)
    items!: ItemDetailsQueryDto[];
}
