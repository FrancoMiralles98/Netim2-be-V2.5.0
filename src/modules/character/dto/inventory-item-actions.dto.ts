import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import type { DiscardInventoryItemRequest, MergeInventoryItemsRequest, SplitInventoryItemRequest } from 'netim2-shared';

export class DiscardInventoryItemDto implements DiscardInventoryItemRequest {
    @IsString()
    @IsNotEmpty()
    itemId!: DiscardInventoryItemRequest['itemId'];
}

export class SplitInventoryItemDto extends DiscardInventoryItemDto implements SplitInventoryItemRequest {
    @IsInt()
    @Min(1)
    @Max(Number.MAX_SAFE_INTEGER)
    quantity!: number;
}

export class MergeInventoryItemsDto extends SplitInventoryItemDto implements MergeInventoryItemsRequest {
    @IsString()
    @IsNotEmpty()
    targetItemId!: MergeInventoryItemsRequest['targetItemId'];
}
