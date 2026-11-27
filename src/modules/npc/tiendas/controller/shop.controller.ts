import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../../../auth/guards/access-token.guard';
import type { AuthRequest } from '../../../auth/types/request/auth-request.type';
import { ShopOrchestratorService } from '../servicios/shop-orchestrator.service';
import { BuyShopItemDto, SellShopItemDto, ShopCharacterParamsDto, ShopParamsDto } from '../types/shop.dto';
import type { BuyShopItemResponse, GetShopItemsResponse, SellShopItemResponse } from 'netim2-shared';

/** Expone los catálogos y operaciones de las cinco tiendas de NPC. */
@Controller('npc/shops')
@UseGuards(AccessTokenGuard)
export class ShopController {
    constructor(private readonly shops: ShopOrchestratorService) {}

    @Get(':shopId/items')
    getItems(@Param() params: ShopParamsDto): { data: GetShopItemsResponse } {
        return { data: this.shops.getItems(params.shopId) };
    }

    @Post(':shopId/characters/:characterId/buy')
    @HttpCode(HttpStatus.OK)
    async buyItem(@Req() request: AuthRequest, @Param() params: ShopCharacterParamsDto,
        @Body() body: BuyShopItemDto): Promise<{ data: BuyShopItemResponse }> {
        return { data: await this.shops.buyItem(params.characterId, request.user.accountId, params.shopId, body) };
    }

    @Post(':shopId/characters/:characterId/sell')
    @HttpCode(HttpStatus.OK)
    async sellItem(@Req() request: AuthRequest, @Param() params: ShopCharacterParamsDto,
        @Body() body: SellShopItemDto): Promise<{ data: SellShopItemResponse }> {
        return { data: await this.shops.sellItem(params.characterId, request.user.accountId, params.shopId, body) };
    }
}
