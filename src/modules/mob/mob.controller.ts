import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { GetMobInfoDto } from './dto/get-mob-info.dto';
import { MobOrchestratorService } from './services/mob-orchestrator.service';
import type { GetMobInfoResponse, GetMobsByUbicationResponse } from 'netim2-shared';
import { GetMobsByUbicationDto } from './dto/get-mobs-by-ubication.dto';

@Controller('mob')
@UseGuards(AccessTokenGuard)
export class MobController {
  constructor(private readonly mobOrchestratorService: MobOrchestratorService) {}

  @Get()
  getMobsByUbication(@Query() query: GetMobsByUbicationDto): { data: GetMobsByUbicationResponse } {
    return { data: this.mobOrchestratorService.getMobsByUbication(query) };
  }

  @Get(':idMob')
  getMobInfo(@Param() params: GetMobInfoDto): { data: GetMobInfoResponse } {
    return { data: this.mobOrchestratorService.getMobInfo(params) };
  }
}
