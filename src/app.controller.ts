import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { BonusService } from './modules/bonus/bonus.service';
import { BonusInItem } from './modules/bonus/types/bonus-in-item.type';
import { ItemDTO } from './modules/item/types/item-dto';
import { ItemService } from './modules/item/item.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly itemService: ItemService,

  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('item')
  getBonus(): ItemDTO {
    return this.itemService.getCoreItemInfoByIdItem(100)
  }
}
