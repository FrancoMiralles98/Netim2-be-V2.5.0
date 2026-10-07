import { Controller, Get } from '@nestjs/common';
import { LabFightService } from './lab/lab-fight.service';

@Controller('fight')
export class FightController {
  constructor(
    private readonly labFightService: LabFightService
  ) { }

  @Get('lab')
  fightLab() {
    const data = this.labFightService.fightLab()
    return { data }
  }
}
