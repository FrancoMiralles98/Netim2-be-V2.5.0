import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { MoveInventoryItemResponse } from 'netim2-shared';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { AuthRequest } from '../../auth/types/request/auth-request.type';
import { MoveInventoryItemDto } from '../dto/move-inventory-item.dto';
import { CharacterInventoryOrchestratorService } from '../services/inventory/character-inventory-orchestrator.service';
import { DiscardInventoryItemDto, MergeInventoryItemsDto, SplitInventoryItemDto } from '../dto/inventory-item-actions.dto';
import type { DiscardInventoryItemResponse, SplitInventoryItemResponse } from 'netim2-shared';
import type { MergeInventoryItemsResponse } from 'netim2-shared';

@Controller('character/:id/inventory')
@UseGuards(AccessTokenGuard)
export class CharacterInventoryController {
    constructor(private readonly characterInventoryOrchestratorService: CharacterInventoryOrchestratorService) {}

    @Post('merge')
    @HttpCode(HttpStatus.OK)
    async mergeItems(@Req() req: AuthRequest, @Param('id') characterId: string, @Body() body: MergeInventoryItemsDto): Promise<{ data: MergeInventoryItemsResponse }> {
        return { data: await this.characterInventoryOrchestratorService.mergeItems(characterId, req.user.accountId, body) };
    }

    @Post('split')
    @HttpCode(HttpStatus.OK)
    async splitItem(@Req() req: AuthRequest, @Param('id') characterId: string, @Body() body: SplitInventoryItemDto): Promise<{ data: SplitInventoryItemResponse }> {
        return { data: await this.characterInventoryOrchestratorService.splitItem(characterId, req.user.accountId, body) };
    }

    @Delete(':itemId')
    async discardItem(@Req() req: AuthRequest, @Param('id') characterId: string, @Param() params: DiscardInventoryItemDto): Promise<{ data: DiscardInventoryItemResponse }> {
        return { data: await this.characterInventoryOrchestratorService.discardItem(characterId, req.user.accountId, params) };
    }

    @Patch('move')
    async moveItem(@Req() req: AuthRequest, @Param('id') characterId: string, @Body() body: MoveInventoryItemDto): Promise<{ data: MoveInventoryItemResponse }> {
        const data = await this.characterInventoryOrchestratorService.moveItem(characterId, req.user.accountId, body.itemId, body.position);
        return { data };
    }
}
