import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { AuraSkillService } from './services/aura-skill.service';
import { BonusDamageService } from './services/bonus-damage.service';
import { SharedSkillService } from './services/shared-skill.service';
import { DamageSkillService } from './services/damage-skill.service';

@Module({
  controllers: [],
  providers: [
    SkillService,
    AuraSkillService,
    BonusDamageService,
    SharedSkillService,
    DamageSkillService
  ],
  exports: [
    SkillService
  ]
})
export class SkillModule {}
