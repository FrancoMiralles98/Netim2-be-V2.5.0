import { Module } from '@nestjs/common';
import { FightService } from './fight.service';
import { FightController } from './fight.controller';
import { SharedModule } from '../shared/shared.module';
import { SkillModule } from '../skill/skill.module';

@Module({
  imports: [
    SharedModule,
    SkillModule
  ],
  controllers: [FightController],
  providers: [
    FightService,
  ],
})
export class FightModule {}
