import { Injectable } from "@nestjs/common";
import { DamageSkillActionResolution, ResolveActionInput } from "../../types/actionResolution/action-resolution.types";
import { UseDamageSkillAction } from "../../types/combatAction/combat-action.types";
import { DamageHitResolution } from "./dama-skill-action-resolver.types";
import { SharedFightService } from "../shared-fight.service";
import { HitModifiersResolverService } from "./hit-modifiers-resolver.service";
import { DmgModifierResolverService } from "./dmg-modifier-resolver.service";
import { DamageCalculatorService } from "../damage-calculator.service";
import { BuffManager } from "../../manager/buff-manager";
import { ContextualBonusService } from "../contextual-bonus.service";
import { SkillHitResolver } from "./skill-hit-resolver.service";
import { StatusEffectApplicationResolverService } from "./status-effect-application-resolver.service";
import { HealingResolverService } from "./healing-resolver.service";

@Injectable()
export class DamageSkillActionResolver {
    constructor(
        private sharedFightSerivice: SharedFightService,
        private hitModifiersResolverService: HitModifiersResolverService,
        private dmgModifiersResolverService: DmgModifierResolverService,
        private damageCalculatorService: DamageCalculatorService,
        private contextualBonusService: ContextualBonusService,
        private skillHitResolver: SkillHitResolver,
        private healingResolver: HealingResolverService,
        private buffManager: BuffManager,
        private statusEffectsApplicationResolver: StatusEffectApplicationResolverService

    ) { }

    resolve({ action, context }: ResolveActionInput<UseDamageSkillAction>): DamageSkillActionResolution {
        const skill = context.actor.getSkillById(action.skillId)
        if (!skill || skill.type !== 'damage') {
            throw new Error('Tiene que ser una skill de daño')
        }
        if (!this.sharedFightSerivice.canUseSkill(context.actor, skill)) {
            throw new Error('No puede usar esta skill')
        }
        const target = context.fight.getFighter(action.targetId)
        this.sharedFightSerivice.validateAction({ actor: context.actor, target, skill })

        const manaCost = this.sharedFightSerivice.getInitialManaCost(skill)

        const PreparedSkillDamage = this.damageCalculatorService.prepareSkillDamage(context.actor, skill)
        const hitModifierResult = this.hitModifiersResolverService.resolveSkillHitsCount(skill.hitModifiers)
        const dmgModifierResult = this.dmgModifiersResolverService.resolveSkillDamageModifier({
            modifier: skill.damageModifiers,
            source: context.actor,
            target: target
        })

        const buffDamageMultiplier = this.buffManager.getSkillDamageMultiplier(context.actor, skill.id)
        const contextualBonusDmgMultiplier = this.contextualBonusService.getPossibleSkillBonusMultiplier(
            context.actor, target, skill)

        const manaSpent = context.actor.spendMana(manaCost)

        this.buffManager.consumeForSkill({
            skillId: skill.id,
            target: context.actor,
            trigger: 'skill_use'
        })

        const hits: DamageHitResolution[] = [];

        let totalBaseDamage = 0;
        let totalModifiedDamage = 0;
        let totalMitigatedDamage = 0;
        let totalAppliedDamage = 0;

        for (let hitIndex = 0; hitIndex < hitModifierResult.hitCount; hitIndex++) {
            if (!target.isAlive()) {
                break;
            }

            const hitResult = this.skillHitResolver.resolveHit({
                attacker: context.actor,
                buffDamageMultiplier,
                contextualBonusDamageMultiplier: contextualBonusDmgMultiplier,
                dmgMultiplierPerHit: hitModifierResult.dmgMultiplierPerHit,
                hitIndex,
                preparedDamage: PreparedSkillDamage,
                skill,
                skillDamageMultiplier: dmgModifierResult.multiplier,
                target
            })

            hits.push(hitResult)

            totalBaseDamage += hitResult.totalBaseDamage;

            totalModifiedDamage += hitResult.totalModifiedDamage;

            totalMitigatedDamage += hitResult.totalMitigatedDamage;

            totalAppliedDamage += hitResult.totalAppliedDamage;
        }

        const statusEffects = this.statusEffectsApplicationResolver.resolveSkillEffects({
            appliedOnTurn: context.turnNumber,
            skill,
            source: context.actor,
            target,
            triggeringDamage: totalBaseDamage
        })

        if (skill.cd.onActivate) {
            context.actor.startSkillCooldown(skill.id, skill.cd.onActivate)
        }



        return {
            type: 'use_damage_skill',
            actorId: context.actor.id,
            cooldownRemainingTurns: context.actor.getSkillRemainingCooldown(skill.id),
            hitCount: hitModifierResult.hitCount,
            hits,
            manaSpent: manaSpent.amount,
            remainingMana: manaSpent.manaAfter,
            skillId: skill.id,
            statusEffects,
            success: true,
            targetDefeated: !target.isAlive(),
            targetId: target.id,
            totalAppliedDamage,
            totalBaseDamage,
            totalMitigatedDamage,
            totalModifiedDamage
        }
    }
}