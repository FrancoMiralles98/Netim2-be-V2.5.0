import { Module } from '@nestjs/common';
import { BonusService } from './bonus.service';

@Module({
  controllers: [],
  providers: [BonusService],
})
export class BonusModule {}
