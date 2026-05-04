import { Module } from '@nestjs/common';
import { GenerateBonusService } from './services/generate-bonus.service';
import { BonusService } from './bonus.service';

@Module({
  controllers: [],
  providers: [GenerateBonusService,BonusService],
})
export class BonusModule {}
