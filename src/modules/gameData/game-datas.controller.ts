import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { GameDatasService } from './game-datas.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { AuthRequest } from '../auth/types/request/auth-request.type';
import type { GameConfigApiResponse } from './types/game-config-response.type';
import { GetGameConfigDto } from './dto/get-game-config.dto';

@Controller('game-data')
@UseGuards(AccessTokenGuard)
export class GameDatasController {
  constructor(private readonly gameDatasService: GameDatasService) { }

  @Get('config')
  getGameConfig(@Query() query: GetGameConfigDto): { data: GameConfigApiResponse } {
    return { data: this.gameDatasService.getGameConfig(query.race, query.speciality) };
  }

  @Get('character-selection-data')
  async getCharacterSelectionData(@Req() request: AuthRequest) {
    const data = await this.gameDatasService.getCharacterSelectionData(request.user.accountId)
    return { data }
  }

}
