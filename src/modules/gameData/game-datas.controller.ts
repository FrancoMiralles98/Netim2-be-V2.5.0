import { Controller } from '@nestjs/common';
import { GameDatasService } from './game-datas.service';

@Controller('game-datas')
export class GameDatasController {
  constructor(private readonly gameDatasService: GameDatasService) {}
}
