import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ItemService } from './modules/item/item.service';
import { ItemDTO } from 'netim2-shared';

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
