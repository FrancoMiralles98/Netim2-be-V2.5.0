import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { AuraSkillService } from './services/aura/aura-skill.service';
import { SharedSkillScalingService } from './services/shared-skill-scaling.service';
import { SkillScalingConfigService } from './services/skill-scaling-config.service';
import { DamageSkillService } from './services/damage/damage-skill.service';
import { SharedModule } from '../shared/shared.module';
import { DamageCalculatorService } from './services/damage/damage-calculator.service';
import { ModifiersCalculatorService } from './services/damage/modifiers-calculator.service';
import { EffectsCalculatorService } from './services/damage/effects-calculator.service';
import { BuffSkillService } from './services/buffo/buff-skill.service';
import { HealSkillService } from './services/heal/heal-skill.service';

@Module({
  imports: [
    SharedModule
  ],
  controllers: [],
  providers: [
    SkillService,
    HealSkillService,
    AuraSkillService,
    SharedSkillScalingService,
    SkillScalingConfigService,
    DamageCalculatorService,
    ModifiersCalculatorService,
    EffectsCalculatorService,
    BuffSkillService,
    DamageSkillService
  ],
  exports: [
    SkillService,
    SharedSkillScalingService
  ]
})
export class SkillModule { }
