import { Module } from '@nestjs/common';
import { FightService } from './fight.service';
import { FightController } from './fight.controller';
import { SharedModule } from '../shared/shared.module';
import { AttackerService } from './services/attacker/attacker.service';
import { FightBasicAttackService } from './services/attacker/fight-basic-attack.service';
import { FightSkillService } from './services/attacker/fight-skill.service';
import { DefenderService } from './services/defender/defender.service';
import { FightBasicAttackDefenseService } from './services/defender/fight-basic-attack-defense.service';
import { FightSkillDefenseService } from './services/defender/fight-skill-defense.service';
import { BonusEffectService } from './services/effects/bonus-effect.service';
import { CcEffectService } from './services/effects/cc-effect.service';
import { DamageEffectService } from './services/effects/damage-effect.service';
import { EffectsService } from './services/effects/effect.service';
import { AttackerFightDetailsService } from './services/util/attacker-fight-details.service';
import { DefenderFightDetailsService } from './services/util/defender-fight-details.service';
import { FightDetailsService } from './services/util/fight-details.service';
import { HpService } from './services/util/hp.service';
import { FightTurnService } from './services/fight-turn.service';
import { FightFactory } from './factory/fight-factory';

@Module({
  imports: [
    SharedModule
  ],
  controllers: [FightController],
  providers: [
    FightService,
    AttackerService,
    FightBasicAttackService,
    FightSkillService,
    DefenderService,
    FightBasicAttackDefenseService,
    FightSkillDefenseService,
    BonusEffectService,
    CcEffectService,
    DamageEffectService,
    EffectsService,
    AttackerFightDetailsService,
    DefenderFightDetailsService,
    FightDetailsService,
    HpService,
    FightTurnService,
    FightFactory
  ],
})
export class FightModule {}
