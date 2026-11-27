import { IsInt, IsMongoId, IsNotEmpty, IsOptional, IsString, Matches, Max, Min } from 'class-validator';
import type { IdItemList, PreviewForgeUpgradeRequest, UpgradeForgeItemRequest } from 'netim2-shared';

export class ForgeCharacterParamsDto {
    @IsMongoId()
    characterId!: string;
}

export class PreviewForgeUpgradeDto implements PreviewForgeUpgradeRequest {
    @IsString()
    @IsNotEmpty()
    @Matches(/\S/)
    itemId!: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Matches(/\S/)
    modifierItemId?: string;
}

export class UpgradeForgeItemDto implements UpgradeForgeItemRequest {
    @IsString()
    @IsNotEmpty()
    @Matches(/\S/)
    itemId!: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(Number.MAX_SAFE_INTEGER)
    modifierIdItem?: IdItemList;
}
