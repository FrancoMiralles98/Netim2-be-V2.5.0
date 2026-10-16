import { Type } from 'class-transformer';
import { IsDefined, IsInt, IsNotEmpty, IsObject, IsString, Min, ValidateNested } from 'class-validator';
import { MoveInventoryItemRequest, Position } from 'netim2-shared';

export class InventoryPositionDto implements Position {
    @IsInt()
    @Min(0)
    row!: number;

    @IsInt()
    @Min(0)
    col!: number;
}

export class MoveInventoryItemDto implements MoveInventoryItemRequest {
    @IsString()
    @IsNotEmpty()
    itemId!: MoveInventoryItemRequest['itemId'];

    @IsDefined()
    @IsObject()
    @ValidateNested()
    @Type(() => InventoryPositionDto)
    position!: InventoryPositionDto;
}
