import { Module } from '@nestjs/common';
import { GameDatasService } from './game-datas.service';
import { GameDatasController } from './game-datas.controller';

@Module({
  controllers: [GameDatasController],
  providers: [GameDatasService],
})
export class GameDatasModule {}
