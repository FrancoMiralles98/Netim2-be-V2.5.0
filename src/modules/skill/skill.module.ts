import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { AuraSkillService } from './services/aura-skill.service';
import { SharedSkillService } from './services/shared-skill.service';
import { DamageSkillService } from './services/damage/damage-skill.service';
import { SharedModule } from '../shared/shared.module';
import { DamageCalculatorService } from './services/damage/damage-calculator.service';
import { ModifiersCalculatorService } from './services/damage/modifiers-calculator.service';
import { EffectsCalculatorService } from './services/damage/effects-calculator.service';

@Module({
  imports: [
    SharedModule
  ],
  controllers: [],
  providers: [
    SkillService,
    AuraSkillService,
    SharedSkillService,
    DamageCalculatorService,
    ModifiersCalculatorService,
    EffectsCalculatorService,
    DamageSkillService
  ],
  exports: [
    SkillService
  ]
})
export class SkillModule { }
