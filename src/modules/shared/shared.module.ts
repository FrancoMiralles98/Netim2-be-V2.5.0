import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { SharedController } from './shared.controller';
import { RngService } from './services/rng.service';
import { BonusSharedService } from './services/bonus-shared.service';

@Module({
  controllers: [SharedController],
  providers: [
    SharedService,
    RngService,
    BonusSharedService
  ],
  exports: [
    RngService,
    BonusSharedService
  ]
})
export class SharedModule {}
