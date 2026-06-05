import { Module } from '@nestjs/common';
import { DropService } from './drop.service';
import { DropController } from './drop.controller';
import { SharedModule } from '../shared/shared.module';
import { BonusModule } from '../bonus/bonus.module';
import { ItemModule } from '../item/item.module';
import { EquipItemDropService } from './service/equipment-item-drop.service';
import { ItemDropService } from './service/item-drop.service';
import { MicsBonusService } from './service/miscs-bonus.service';
import { UtilityItemDropService } from './service/utility-item-drop.service';

@Module({
  imports: [
    SharedModule,
    BonusModule,
    ItemModule
  ],
  controllers: [DropController],
  providers: [
    DropService,
    EquipItemDropService,
    ItemDropService,
    MicsBonusService,
    UtilityItemDropService
  ],
})
export class DropModule {}
