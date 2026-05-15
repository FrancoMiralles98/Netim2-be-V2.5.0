import { Controller } from '@nestjs/common';
import { FightService } from './fight.service';

@Controller('fight')
export class FightController {
  constructor(private readonly fightService: FightService) {}
}
