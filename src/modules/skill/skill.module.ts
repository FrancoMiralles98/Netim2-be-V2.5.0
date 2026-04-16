import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';

@Module({
  controllers: [],
  providers: [SkillService],
})
export class SkillModule {}
