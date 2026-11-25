import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import type { GetHistorialResponse, PartialHistorialDetalle } from 'netim2-shared';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import type { AuthRequest } from '../auth/types/request/auth-request.type';
import { GetPartialsHistorialesQueryDto, HistorialCharacterParamsDto, HistorialDetailParamsDto } from './dto/get-historial.dto';
import { HistorialQueryService } from './services/historial-query.service';

@Controller('historial')
@UseGuards(AccessTokenGuard)
export class HistorialController {
  constructor(private readonly historiales: HistorialQueryService) {}

  /** Lista los resúmenes de combate del personaje, con filtro opcional. */
  @Get(':characterId/partials')
  async getPartialsHistoriales(@Req() request: AuthRequest, @Param() params: HistorialCharacterParamsDto,
    @Query() query: GetPartialsHistorialesQueryDto): Promise<{ data: PartialHistorialDetalle[] }> {
    return { data: await this.historiales.getPartialsHistoriales(params.characterId, request.user.accountId, query.filtro) };
  }

  /** Devuelve el detalle del historial indicado para el personaje autenticado. */
  @Get(':characterId/:historialId')
  async getHistorialById(@Req() request: AuthRequest,
    @Param() params: HistorialDetailParamsDto): Promise<{ data: GetHistorialResponse }> {
    return { data: await this.historiales.getHistorialById(params.historialId, params.characterId, request.user.accountId) };
  }
}
