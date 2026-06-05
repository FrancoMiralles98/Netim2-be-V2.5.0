import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { ItemFactory } from './factories/item-factory';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    SharedModule
  ],
  controllers: [ItemController],
  providers: [
    ItemService,
    ItemFactory
  ],
  exports: [
    ItemFactory,
    ItemService
  ]
})
export class ItemModule {}
