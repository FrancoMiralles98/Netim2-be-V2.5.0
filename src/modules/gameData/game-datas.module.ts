import { Module } from '@nestjs/common';
import { GameDatasService } from './game-datas.service';
import { GameDatasController } from './game-datas.controller';
import { AuthModule } from '../auth/auth.module';
import { CharacterModule } from '../character/character.module';

@Module({
  imports: [AuthModule,CharacterModule],
  controllers: [GameDatasController],
  providers: [GameDatasService],
})
export class GameDatasModule {}
