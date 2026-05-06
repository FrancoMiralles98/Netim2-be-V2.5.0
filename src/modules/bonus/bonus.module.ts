import { Module } from '@nestjs/common';
import { GenerateBonusService } from './services/generate-bonus.service';
import { BonusService } from './bonus.service';
import { LimitBonusService } from './services/limit-bonus.service';
import { SpecialBonusService } from './services/special-bonus.service';
import { ItemLevelScalingService } from './services/item-level-scaling.service';
import { BonusWeightService } from './services/bonus-weight.service';

@Module({
  controllers: [],
  providers: [
    GenerateBonusService,
    BonusService,
    LimitBonusService,
    SpecialBonusService,
    ItemLevelScalingService,
    BonusWeightService
  ],
})
export class BonusModule {}
