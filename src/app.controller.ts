import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
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
