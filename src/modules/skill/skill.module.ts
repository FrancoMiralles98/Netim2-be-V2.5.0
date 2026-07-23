import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { AuraSkillService } from './services/aura-skill.service';
import { SharedSkillService } from './services/shared-skill.service';
import { DamageSkillService } from './services/damage-skill.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    SharedModule
  ],
  controllers: [],
  providers: [
    SkillService,
    AuraSkillService,
    SharedSkillService,
    DamageSkillService
  ],
  exports: [
    SkillService
  ]
})
export class SkillModule {}
