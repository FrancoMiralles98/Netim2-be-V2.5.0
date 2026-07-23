import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { SharedController } from './shared.controller';
import { RngService } from './services/rng.service';
import { BonusSharedService } from './services/bonus-shared.service';
import { HashSharedService } from './services/hash-shared.service';
import { CharacterSharedService } from './services/character-shared.service';

@Module({
  controllers: [SharedController],
  providers: [
    SharedService,
    RngService,
    BonusSharedService,
    HashSharedService,
    CharacterSharedService
  ],
  exports: [
    RngService,
    BonusSharedService,
    HashSharedService,
    CharacterSharedService
  ]
})
export class SharedModule {}
