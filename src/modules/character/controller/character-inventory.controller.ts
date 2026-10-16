import { Body, Controller, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { MoveInventoryItemResponse } from 'netim2-shared';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { AuthRequest } from '../../auth/types/request/auth-request.type';
import { MoveInventoryItemDto } from '../dto/move-inventory-item.dto';
import { CharacterInventoryOrchestratorService } from '../services/inventory/character-inventory-orchestrator.service';

@Controller('character/:id/inventory')
@UseGuards(AccessTokenGuard)
export class CharacterInventoryController {
    constructor(private readonly characterInventoryOrchestratorService: CharacterInventoryOrchestratorService) {}

    @Patch('move')
    async moveItem(@Req() req: AuthRequest, @Param('id') characterId: string, @Body() body: MoveInventoryItemDto): Promise<{ data: MoveInventoryItemResponse }> {
        const data = await this.characterInventoryOrchestratorService.moveItem(characterId, req.user.accountId, body.itemId, body.position);
        return { data };
    }
}
