import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { SharedController } from './shared.controller';
import { RngService } from './services/rng.service';
import { BonusSharedService } from './services/bonus-shared.service';
import { HashSharedService } from './services/hash-shared.service';

@Module({
  controllers: [SharedController],
  providers: [
    SharedService,
    RngService,
    BonusSharedService,
    HashSharedService
  ],
  exports: [
    RngService,
    BonusSharedService,
    HashSharedService
  ]
})
export class SharedModule {}
