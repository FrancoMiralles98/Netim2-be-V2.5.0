import { Module } from '@nestjs/common';
import { BonusService } from './bonus.service';
import { LimitBonusService } from './services/limit-bonus.service';
import { SpecialBonusService } from './services/generateBonus/special-bonus.service';
import { ItemLevelScalingService } from './services/generateBonus/item-level-scaling.service';
import { BonusWeightService } from './services/bonus-weight.service';
import { SharedModule } from '../shared/shared.module';
import { GenerateItemBonusService } from './services/generate-item-bonus.service';
import { GenerateBonusService } from './services/generateBonus/generate-bonus.service';

@Module({
  imports: [
    SharedModule
  ],  
  controllers: [],
  providers: [
    GenerateBonusService,
    BonusService,
    LimitBonusService,
    SpecialBonusService,
    ItemLevelScalingService,
    BonusWeightService,
    GenerateItemBonusService
  ],
  exports:[
    BonusService
  ]
})
export class BonusModule {}
