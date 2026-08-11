import { Module } from '@nestjs/common';
import { FightService } from './fight.service';
import { FightController } from './fight.controller';
import { SharedModule } from '../shared/shared.module';
import { ActionResolutionService } from './services/action/action-resolution.service';
import { CombatActionSelectorService } from './services/action/combat-action-selector.service';
import { AuraUnkeepProcessorService } from './services/processors/aura-unkeep-processor.service';
import { ControlEffectProcessorService } from './services/processors/control-effect-processor.service';
import { CooldownProcessorService } from './services/processors/cooldown.processor.service';
import { RegenerationProcessorService } from './services/processors/regeneration-processor.service';
import { StatusEffectProcessorService } from './services/processors/status-effect-processor.service';
import { AuraActionResolverService } from './services/resolvers/aura-action-resolver.service';
import { BasicAttackActionResolverService } from './services/resolvers/basic-attack-action-resolver.service';
import { BasicAttackHitResolverService } from './services/resolvers/basic-attack-hit-resolver.service';
import { BuffActionResolver } from './services/resolvers/buff-action-resolver.service';
import { CriticalDamageResolverService } from './services/resolvers/critical-damage-resolver.service';
import { DamageResolverService } from './services/resolvers/damage-resolver.service';
import { DamageSkillActionResolver } from './services/resolvers/damage-skill-action-resolver.service';
import { DmgMitigationResolverService } from './services/resolvers/dmg-mitigation-resolver.service';
import { DmgModifierResolverService } from './services/resolvers/dmg-modifier-resolver.service';
import { HealingResolverService } from './services/resolvers/healing-resolver.service';
import { HealingSkillActionResolverService } from './services/resolvers/healing-skill-action-resolver.service';
import { HitModifiersResolverService } from './services/resolvers/hit-modifiers-resolver.service';
import { LifeStealResolverService } from './services/resolvers/life-steal-resolver.service';
import { PeriodicStatusEffectResolverService } from './services/resolvers/periodic-status-effect-resolver.service';
import { SkillHitResolver } from './services/resolvers/skill-hit-resolver.service';
import { StatusEffectApplicationResolverService } from './services/resolvers/status-effect-application-resolver.service';
import { TurnEndProcessorService } from './services/turn/turn-end-processor.service';
import { TurnStartProcessorSerivce } from './services/turn/turn-start-processor.service';
import { ContextualBonusService } from './services/contextual-bonus.service';
import { DamageCalculatorService } from './services/damage-calculator.service';
import { SharedFightService } from './services/shared-fight.service';
import { AuraManager } from './manager/aura-manager';
import { BuffManager } from './manager/buff-manager';
import { FightManager } from './manager/fight-manager';
import { StatusEffectManager } from './manager/status-effect-manager';
import { TurnManager } from './manager/turn-manager';
import { FightFactory } from './factories/fight.factory';
import { FighterCombatFactory } from './factories/fighter-combat-entity.factory';
import { CharacterModule } from '../character/character.module';
import { MobModule } from '../mob/mob.module';
import { TargetSelectorService } from './services/action/target-selector.service';

@Module({
  imports: [
    SharedModule,
    CharacterModule,
    MobModule
  ],
  controllers: [FightController],
  providers: [
    FightService,
    ActionResolutionService,
    CombatActionSelectorService,
    AuraUnkeepProcessorService,
    ControlEffectProcessorService,
    CooldownProcessorService,
    RegenerationProcessorService,
    StatusEffectProcessorService,
    AuraActionResolverService,
    BasicAttackActionResolverService,
    BasicAttackHitResolverService,
    BuffActionResolver,
    CriticalDamageResolverService,
    DamageResolverService,
    DamageSkillActionResolver,
    DmgMitigationResolverService,
    DmgModifierResolverService,
    HealingResolverService,
    HealingSkillActionResolverService,
    HitModifiersResolverService,
    LifeStealResolverService,
    PeriodicStatusEffectResolverService,
    SkillHitResolver,
    StatusEffectApplicationResolverService,
    TurnEndProcessorService,
    TurnStartProcessorSerivce,
    ContextualBonusService,
    DamageCalculatorService,
    SharedFightService,
    AuraManager,
    BuffManager,
    FightManager,
    StatusEffectManager,
    TurnManager,
    FightFactory,
    FighterCombatFactory,
    TargetSelectorService
  ],
})
export class FightModule { }
