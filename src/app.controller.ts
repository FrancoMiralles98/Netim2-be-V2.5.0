import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { BonusService } from './modules/bonus/bonus.service';
import { BonusInItem } from './modules/bonus/types/bonus-in-item.type';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly bonusService: BonusService
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('bonus')
  getBonus(): BonusInItem[] {
    return this.bonusService.generatorBonus(
      'generic',
      [{},{},{},{}] as BonusInItem[],
      100,
      'unique',
      4
      ,
      'change',
      'arma'
    );
  }
}
