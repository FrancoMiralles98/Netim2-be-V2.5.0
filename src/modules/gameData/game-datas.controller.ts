import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { GameDatasService } from './game-datas.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { AuthRequest } from '../auth/types/request/auth-request.type';
import { GameConfigResponse } from 'netim2-shared';

@Controller('game-data')
@UseGuards(AccessTokenGuard)
export class GameDatasController {
  constructor(private readonly gameDatasService: GameDatasService) { }

  @Get('config')
  getGameConfig(): { data: GameConfigResponse } {
    return { data: this.gameDatasService.getGameConfig() };
  }

  @Get('character-selection-data')
  async getCharacterSelectionData(@Req() request: AuthRequest) {
    const data = await this.gameDatasService.getCharacterSelectionData(request.user.accountId)
    return { data }
  }

}
