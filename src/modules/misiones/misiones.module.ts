import { Module } from '@nestjs/common';
import { MisionesService } from './misiones.service';
import { MisionesController } from './misiones.controller';
import { ItemModule } from '../item/item.module';
import { MissionCatalogService } from './services/mission-catalog.service';
import { MissionProgressService } from './services/mission-progress.service';
import { MissionRewardService } from './services/mission-reward.service';

@Module({
  imports: [
    ItemModule
  ],
  controllers: [MisionesController],
  providers: [
    MisionesService,
    MissionCatalogService,
    MissionProgressService,
    MissionRewardService
  ],
  exports: [
    MisionesService
  ]
})
export class MisionesModule {}
