import { IsIn, IsInt, IsMongoId, IsNotEmpty, IsOptional, IsString, Matches, Max, Min } from 'class-validator';
import { NPC_SHOP_IDS } from 'netim2-shared/dist/npc/shop.types';
import type { BuyShopItemRequest, GetShopItemsRequest, IdItemList, NpcShopId, SellShopItemRequest, UpgradeLv } from 'netim2-shared';

export class ShopParamsDto implements GetShopItemsRequest {
    @IsIn(NPC_SHOP_IDS)
    shopId!: NpcShopId;
}

export class ShopCharacterParamsDto extends ShopParamsDto {
    @IsMongoId()
    characterId!: string;
}

export class BuyShopItemDto implements BuyShopItemRequest {
    @IsInt()
    @Min(0)
    @Max(Number.MAX_SAFE_INTEGER)
    idItem!: IdItemList;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(Number.MAX_SAFE_INTEGER)
    quantity?: number;

    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(Number.MAX_SAFE_INTEGER)
    upgradeLv?: UpgradeLv;
}

export class SellShopItemDto implements SellShopItemRequest {
    @IsString()
    @IsNotEmpty()
    @Matches(/\S/)
    itemId!: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(Number.MAX_SAFE_INTEGER)
    quantity?: number;
}
