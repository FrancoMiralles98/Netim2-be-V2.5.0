import { Body, Controller, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../../auth/guards/access-token.guard';
import type { AuthRequest } from '../../auth/types/request/auth-request.type';
import { FightCharacterMobDto, FightCharacterParamsDto } from '../dto/fight-character-mob.dto';
import { CharacterFightOrchestratorService } from '../services/fight/character-fight-orchestrator.service';
import type { CharacterFightResultResponse } from 'netim2-shared';

/** Expone las acciones de combate del personaje autenticado. */
@Controller('character/:id/fight')
@UseGuards(AccessTokenGuard)
export class CharacterFightController {
    constructor(private readonly fights: CharacterFightOrchestratorService) {}

    /** Ejecuta la pelea del personaje contra el mob de catálogo indicado. */
    @Post('mob')
    @HttpCode(HttpStatus.OK)
    async fightMob(@Req() request: AuthRequest, @Param() params: FightCharacterParamsDto,
        @Body() body: FightCharacterMobDto): Promise<{ data: CharacterFightResultResponse }> {
        return { data: await this.fights.fightMob(params.id, request.user.accountId, body) };
    }
}
