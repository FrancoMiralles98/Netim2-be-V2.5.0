import { Body, Controller, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import { AuthRequest } from '../../auth/types/request/auth-request.type';
import { QuickHealDto } from '../dto/quick-heal.dto';
import { UsePotionDto } from '../dto/use-potion.dto';
import { UseReservePotionDto } from '../dto/use-reserve-potion.dto';
import { CharacterItemUseOrchestratorService } from '../services/item-use/character-item-use-orchestrator.service';
import type { QuickHealResponse, UsePotionResponse, UseReservePotionResponse } from 'netim2-shared';
import { ApplyBuffDto } from '../dto/apply-buff.dto';
import type { ApplyBuffResponse, RefreshBuffsResponse } from 'netim2-shared';
import { OpenChestDto } from '../dto/open-chest.dto';
import type { OpenChestResponse } from 'netim2-shared';
import { OpenChestBulkDto } from '../dto/open-chest-bulk.dto';
import type { OpenChestBulkResponse } from 'netim2-shared';

@Controller('character/:id/item-use')
@UseGuards(AccessTokenGuard)
export class CharacterItemUseController {
    constructor(private readonly itemUseService: CharacterItemUseOrchestratorService) {}

    @Post('chests/bulk')
    @HttpCode(HttpStatus.OK)
    async openChestBulk(@Req() req: AuthRequest, @Param('id') characterId: string, @Body() body: OpenChestBulkDto): Promise<{ data: OpenChestBulkResponse }> {
        return { data: await this.itemUseService.openChestBulk(characterId, req.user.accountId, body) };
    }

    @Post('chests')
    @HttpCode(HttpStatus.OK)
    async openChest(@Req() req: AuthRequest, @Param('id') characterId: string, @Body() body: OpenChestDto): Promise<{ data: OpenChestResponse }> {
        return { data: await this.itemUseService.openChest(characterId, req.user.accountId, body) };
    }

    @Post('buffs')
    @HttpCode(HttpStatus.OK)
    async applyBuff(@Req() req: AuthRequest, @Param('id') characterId: string, @Body() body: ApplyBuffDto): Promise<{ data: ApplyBuffResponse }> {
        return { data: await this.itemUseService.applyBuff(characterId, req.user.accountId, body) };
    }

    @Post('buffs/refresh')
    @HttpCode(HttpStatus.OK)
    async refreshBuffs(@Req() req: AuthRequest, @Param('id') characterId: string): Promise<{ data: RefreshBuffsResponse }> {
        return { data: await this.itemUseService.refreshBuffs(characterId, req.user.accountId) };
    }

    @Post('potions')
    @HttpCode(HttpStatus.OK)
    async usePotion(@Req() req: AuthRequest, @Param('id') characterId: string, @Body() body: UsePotionDto): Promise<{ data: UsePotionResponse }> {
        return { data: await this.itemUseService.usePotion(characterId, req.user.accountId, body) };
    }

    @Post('potions/reserve')
    @HttpCode(HttpStatus.OK)
    async useReservePotion(@Req() req: AuthRequest, @Param('id') characterId: string, @Body() body: UseReservePotionDto): Promise<{ data: UseReservePotionResponse }> {
        return { data: await this.itemUseService.useReservePotion(characterId, req.user.accountId, body) };
    }

    @Post('potions/quick-heal')
    @HttpCode(HttpStatus.OK)
    async quickHeal(@Req() req: AuthRequest, @Param('id') characterId: string, @Body() body: QuickHealDto): Promise<{ data: QuickHealResponse }> {
        return { data: await this.itemUseService.quickHeal(characterId, req.user.accountId, body) };
    }
}
