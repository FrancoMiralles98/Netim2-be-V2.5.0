import { Injectable } from "@nestjs/common";
import { DamageSkillActionResolution, ResolveActionInput } from "../../types/actionResolution/action-resolution.types";
import { AppliedStatusEffectResolution, DamageHitResolution } from "./dama-skill-action-resolver.types";
import { SharedFightService } from "../shared-fight.service";
import { HitModifiersResolverService } from "./hit-modifiers-resolver.service";
import { DmgModifierResolverService } from "./dmg-modifier-resolver.service";
import { DamageCalculatorService } from "../damage-calculator.service";
import { BuffManager } from "../../manager/buff-manager";
import { ContextualBonusService } from "../contextual-bonus.service";
import { SkillHitResolver } from "./skill-hit-resolver.service";
import { StatusEffectApplicationResolverService } from "./status-effect-application-resolver.service";
import { LifeStealResolverService } from "./life-steal-resolver.service";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";
import { FightEntity } from "../../entities/fight.entity";
import { SkillDamage, UseDamageSkillAction } from "netim2-shared";
import { HealingResolution } from "./healing-resolver.types";
import { DamageResolutionResult } from "./damage-resolver.types";
import { ReflectionResolverService } from "./reflection-resolver.service";
import { DamageResolverService } from "./damage-resolver.service";
import { randomUUID } from "crypto";

@Injectable()
export class DamageSkillActionResolver {
    constructor(
        private sharedFightSerivice: SharedFightService,
        private hitModifiersResolverService: HitModifiersResolverService,
        private dmgModifiersResolverService: DmgModifierResolverService,
        private damageCalculatorService: DamageCalculatorService,
        private contextualBonusService: ContextualBonusService,
        private skillHitResolver: SkillHitResolver,
        private reflectionResolverService: ReflectionResolverService,
        private buffManager: BuffManager,
        private statusEffectsApplicationResolver: StatusEffectApplicationResolverService,
        private lifeStealResolverService: LifeStealResolverService,
        private damageResolverService: DamageResolverService,
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

        context.events.push({
            type: 'resource_changed',
            amount: manaSpent.amount,
            currentValue: manaSpent.manaAfter,
            previousValue: manaSpent.manaBefore,
            eventId: randomUUID(),
            fighterId: context.actor.id,
            fightId: context.fight.id,
            reason: 'mana_spent',
            resource: 'mana',
            turnNumber: context.turnNumber
        })

        this.buffManager.consumeForSkill({
            skillId: skill.id,
            target: context.actor,
            trigger: 'skill_use'
        })

        const hits: DamageHitResolution[] = [];
        const statusEffects: AppliedStatusEffectResolution[] = []

        let totalBaseDamage = 0;
        let totalModifiedDamage = 0;
        let totalMitigatedDamage = 0;
        let totalAppliedDamage = 0;

        if (hitModifierResult.hitCount > 1) {
            context.events.push({
                type: 'double_hit_triggered',
                generatedHitCount: hitModifierResult.hitCount,
                attackerId: context.actor.id,
                eventId: randomUUID(),
                fightId: context.fight.id,
                targetId: action.targetId,
                turnNumber: context.turnNumber
            })
        }

        for (let hitIndex = 0; hitIndex < hitModifierResult.hitCount; hitIndex++) {
            if (!target.isAlive()) {
                break;
            }

            context.events.push({
                type: 'hit_resolved',
                attackerId: context.actor.id,
                hitIndex,
                eventId: randomUUID(),
                fightId: context.fight.id,
                resolution: { result: "hit", critical: false, doble_trigged: false, penetrating: false },
                source: { type: 'skill', skillId: skill.id },
                targetId: action.targetId,
                turnNumber: context.turnNumber
            })

            const hitResult = this.skillHitResolver.resolveHit({
                attacker: context.actor,
                buffDamageMultiplier,
                contextualBonusDamageMultiplier: contextualBonusDmgMultiplier,
                dmgMultiplierPerHit: hitModifierResult.dmgMultiplierPerHit,
                hitIndex,
                preparedDamage: PreparedSkillDamage,
                skill,
                skillDamageMultiplier: dmgModifierResult.multiplier,
                target,
                context
            })



            hits.push(hitResult)

            totalBaseDamage += hitResult.totalBaseDamage;

            totalModifiedDamage += hitResult.totalModifiedDamage;

            totalMitigatedDamage += hitResult.totalMitigatedDamage;

            totalAppliedDamage += hitResult.totalAppliedDamage;

            if (target.isAlive()) {
                const hitStatusEffects = this.statusEffectsApplicationResolver.resolveEffects({
                    appliedOnTurn: context.turnNumber,
                    source: context.actor,
                    effect: skill.statusEffects,
                    target,
                    isCritic: hitResult.critical,
                    triggeringDamage: hitResult.totalBaseDamage,
                    context
                })
                statusEffects.push(...hitStatusEffects)
            }
        }

        const lifeStealResult = this.lifeStealResolverService.resolveSkillLifeSteal({
            attacker: context.actor,
            mechanicsEffects: skill.mechanicsEffects,
            damageDealt: totalAppliedDamage,
            target,
        })

        if (lifeStealResult.effectiveHealing > 0) {
            context.events.push({
                type: 'healing_resolved',
                eventId: randomUUID(),
                fightId: context.fight.id,
                resolution: {
                    appliedHealing: lifeStealResult.effectiveHealing,
                    critical: false,
                    totalPrevented: lifeStealResult.preventedAmount
                },
                source: { type: 'spell_vampirism',skillId: skill.id },
                sourceFighterId: context.actor.id,
                targetCurrentHp: lifeStealResult.hpAfter,
                targetFighterId: context.actor.id,
                targetPreviousHp: lifeStealResult.hpBefore,
                turnNumber: context.turnNumber
            })
        }

        const reflectionResult = this.reflectionResolverService.resolve({
            attacker: context.actor,
            target,
            delivery: 'direct',
            receivedDamage: totalAppliedDamage
        })

        let reflectedDmgResult: DamageResolutionResult | null = null

        if (reflectionResult) {
            reflectedDmgResult = this.damageResolverService.resolve({
                attacker: reflectionResult.source,
                target: reflectionResult.target,
                damage: reflectionResult.damage,
                damageType: reflectionResult.damageType,
                sourceType: 'reflected',
                reflectedFromDamageType: 'true'
            })

            this.reflectionResolverService.reflectionDmgResultRegister(
                reflectionResult.source,
                reflectedDmgResult)
        }


        if (skill.cd.onActivate) {
            const result = context.actor.startSkillCooldown(skill.id, skill.cd.onActivate)
            context.events.push({
                type: 'cooldown_updated',
                eventId: randomUUID(),
                fighterId: context.actor.id,
                fightId: context.fight.id,
                previousRemainingTurns: result.initialTurns,
                remainingTurns: result.remainingTurns,
                skillId: skill.id,
                turnNumber: context.turnNumber
            })
        }


        this.DamageSkillActionStatisticRegister(
            context.actor,
            context.fight,
            hits,
            skill,
            manaSpent.amount,
            lifeStealResult,
            target
        )

        return {
            type: 'use_damage_skill',
            actorId: context.actor.id,
            cooldownRemainingTurns: context.actor.getSkillRemainingCooldown(skill.id),
            hitCount: hitModifierResult.hitCount,
            hits,
            lifeSteal: lifeStealResult,
            reflectedDmgResult,
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

    private DamageSkillActionStatisticRegister(
        actor: FighterCombatEntity,
        fight: FightEntity,
        hits: DamageHitResolution[],
        skill: SkillDamage,
        manaSpent: number,
        lifeStealResult: HealingResolution,
        target: FighterCombatEntity
    ) {
        actor.statistics.registerResources({ manaSpent })
        actor.statistics.registerSkillUsed()

        actor.statistics.registerHealing({
            type: 'skill',
            idSkill: skill.id,
            amount: lifeStealResult.effectiveHealing
        })

        hits.forEach(hit => hit.components.forEach(component => {
            actor.statistics.registerDamageDealt({
                source: {
                    type: 'skill',
                    skillId: skill.id
                },
                amount: component.appliedDamage,
                damageType: component.damageType,
                delivery: 'direct'
            })

            target.statistics.registerDamageMitigated({
                amount: component.mitigatedDamage,
                damageType: component.damageType
            })
        }))


        lifeStealResult.reductions.forEach(reductionDetail => {
            const fighter = fight.getFighter(reductionDetail.sourceFighterId)
            fighter.statistics.registerHealing({
                type: 'prevented',
                amount: reductionDetail.preventedAmount
            })
        })
    }
}