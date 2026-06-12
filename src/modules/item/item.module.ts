import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { ItemFactory } from './factories/item-factory';
import { SharedModule } from '../shared/shared.module';
import { ItemHydrationService } from './services/item-hydration.service';
import { RandomImplicitBonusService } from './services/implicitScaling/random-implicit-bonus.service';
import { PlaneBonusCalculator } from './services/implicitScaling/plane-bonus-calculator.service';
import { ItemImplicitBonusService } from './services/implicitScaling/item-implicit-bonus.service';
import { DinamicStatsCalculatorService } from './services/implicitScaling/dinamic-stats-calculator.service';
import { ConfiguredItemBonusCalculatorService } from './services/implicitScaling/configured-item-bonus-calculator.service';

@Module({
  imports: [
    SharedModule
  ],
  controllers: [ItemController],
  providers: [
    ItemService,
    ItemFactory,
    ItemHydrationService,
    RandomImplicitBonusService,
    PlaneBonusCalculator,
    ItemImplicitBonusService,
    DinamicStatsCalculatorService,
    ConfiguredItemBonusCalculatorService
  ],
  exports: [
    ItemFactory,
    ItemService
  ]
})
export class ItemModule {}
