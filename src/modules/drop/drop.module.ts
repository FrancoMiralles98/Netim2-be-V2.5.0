import { Module } from '@nestjs/common';
import { DropService } from './drop.service';
import { DropController } from './drop.controller';
import { SharedModule } from '../shared/shared.module';
import { BonusModule } from '../bonus/bonus.module';
import { ItemModule } from '../item/item.module';

@Module({
  imports: [
    SharedModule,
    BonusModule,
    ItemModule
  ],
  controllers: [DropController],
  providers: [DropService],
})
export class DropModule {}
