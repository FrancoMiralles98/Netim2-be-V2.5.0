import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ItemService } from './item.service';
import { GetItemsDto } from './dto/get-items.dto';
import type { GetItemsResponse } from 'netim2-shared';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post('details')
  @HttpCode(HttpStatus.OK)
  getItems(@Body() request: GetItemsDto): { data: GetItemsResponse } {
    return { data: this.itemService.getItems(request) };
  }
}
