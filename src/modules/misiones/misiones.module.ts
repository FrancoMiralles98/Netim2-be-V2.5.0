import { Module } from '@nestjs/common';
import { MisionesService } from './misiones.service';
import { ItemModule } from '../item/item.module';
import { MobModule } from '../mob/mob.module';
import { MissionCatalogService } from './services/mission-catalog.service';
import { MissionProgressService } from './services/mission-progress.service';
import { MissionRewardService } from './services/mission-reward.service';

@Module({
  imports: [
    ItemModule,
    MobModule,
  ],
  providers: [
    MisionesService,
    MissionCatalogService,
    MissionProgressService,
    MissionRewardService
  ],
  exports: [
    MisionesService,
    MissionCatalogService,
    MissionProgressService,
    MissionRewardService,
  ]
})
export class MisionesModule {}
