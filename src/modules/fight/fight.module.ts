import { Module } from '@nestjs/common';
import { FightService } from './fight.service';
import { FightController } from './fight.controller';

@Module({
  controllers: [FightController],
  providers: [FightService],
})
export class FightModule {}
