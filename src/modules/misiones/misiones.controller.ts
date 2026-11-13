import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import type { AuthRequest } from '../auth/types/request/auth-request.type';
import { AcceptMissionDto, MissionAttemptDto } from './dto/mission.dto';
import { MissionOrchestratorService } from './services/mission-orchestrator.service';
import type { AcceptMissionResponse, ClaimMissionResponse, MissionListResponse, RemoveFailedMissionResponse } from './types/mission-api.types';

/** Expone el listado y las operaciones de misiones del personaje autenticado. */
@Controller('character/:id/missions')
@UseGuards(AccessTokenGuard)
export class MisionesController {
    constructor(private readonly missions: MissionOrchestratorService) {}

    /** Lista las misiones disponibles y los intentos del personaje. */
    @Get()
    async list(@Req() request: AuthRequest, @Param('id') id: string): Promise<{ data: MissionListResponse }> {
        return { data: await this.missions.list(id, request.user.accountId) };
    }

    /** Acepta la misión indicada. */
    @Post('accept')
    @HttpCode(HttpStatus.OK)
    async accept(@Req() request: AuthRequest, @Param('id') id: string,
        @Body() body: AcceptMissionDto): Promise<{ data: AcceptMissionResponse }> {
        return { data: await this.missions.accept(id, request.user.accountId, body) };
    }

    /** Reclama la recompensa del intento indicado. */
    @Post('claim')
    @HttpCode(HttpStatus.OK)
    async claim(@Req() request: AuthRequest, @Param('id') id: string,
        @Body() body: MissionAttemptDto): Promise<{ data: ClaimMissionResponse }> {
        return { data: await this.missions.claim(id, request.user.accountId, body) };
    }

    /** Elimina un intento vencido para que la misión pueda volver a aceptarse. */
    @Post('remove-failed')
    @HttpCode(HttpStatus.OK)
    async removeFailed(@Req() request: AuthRequest, @Param('id') id: string,
        @Body() body: MissionAttemptDto): Promise<{ data: RemoveFailedMissionResponse }> {
        return { data: await this.missions.removeFailed(id, request.user.accountId, body) };
    }
}
