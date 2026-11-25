import { Body, Controller, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import type { AuthRequest } from '../../auth/types/request/auth-request.type';
import { CharacterHistoryParamsDto, ClaimHistoryRewardsDto } from '../dto/claim-history-rewards.dto';
import { CharacterHistorialOrchestratorService } from '../services/historial/character-historial-orchestrator.service';
import type { ClaimCharacterHistoryRewardsResponse } from '../types/claim-character-history-rewards-response.type';

/** Expone el reclamo de recompensas pendientes del personaje autenticado. */
@Controller('character/:id/historial')
@UseGuards(AccessTokenGuard)
export class CharacterHistorialController {
    constructor(private readonly histories: CharacterHistorialOrchestratorService) {}

    /** Reclama todas las recompensas seleccionadas o rechaza el lote completo. */
    @Post('claim')
    @HttpCode(HttpStatus.OK)
    async claimRewards(@Req() request: AuthRequest, @Param() params: CharacterHistoryParamsDto,
        @Body() body: ClaimHistoryRewardsDto): Promise<{ data: ClaimCharacterHistoryRewardsResponse }> {
        return { data: await this.histories.claimRewards(params.id, request.user.accountId, body) };
    }
}
