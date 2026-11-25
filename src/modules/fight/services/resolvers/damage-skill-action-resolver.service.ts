import { HitConsequencesResolverService } from './hit-consequences-resolver.service';
import type { CombatHitResult } from 'netim2-shared';
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
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";
import { FightEntity } from "../../entities/fight.entity";
import { SkillDamage, UseDamageSkillAction } from "netim2-shared";
import { HealingResolution } from "./healing-resolver.types";

@Injectable()
export class DamageSkillActionResolver {
    constructor(
        private sharedFightSerivice: SharedFightService,
        private hitModifiersResolverService: HitModifiersResolverService,
        private dmgModifiersResolverService: DmgModifierResolverService,
        private damageCalculatorService: DamageCalculatorService,
        private contextualBonusService: ContextualBonusService,
        private skillHitResolver: SkillHitResolver,
        private buffManager: BuffManager,
        private readonly consequences: HitConsequencesResolverService,
    ) { }

    /** Sortea los modificadores una vez y resuelve las consecuencias de cada hit. */
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
            resource: 'mana',
        })

        const buffConsumeResult = this.buffManager.consumeForSkill({
            skillId: skill.id,
            target: context.actor,
            trigger: 'skill_use'
        })

        if (buffConsumeResult.consumed) {
            buffConsumeResult.buffs.forEach(buffConsumed=> {
                context.events.push({
                    type: 'buff_deactivated',
                    skillId: buffConsumed.skillId
                })
            })
        }

        const hits: DamageHitResolution[] = [];
        const hitResults: CombatHitResult[] = [];
        const consequences: ReturnType<HitConsequencesResolverService['resolve']>[] = [];
        const statusEffects: AppliedStatusEffectResolution[] = []

        let totalBaseDamage = 0;
        let totalModifiedDamage = 0;
        let totalMitigatedDamage = 0;
        let totalAppliedDamage = 0;

        if (hitModifierResult.hitCount > 1) {
            context.events.push({
                type: 'double_hit_triggered',
                generatedHitCount: hitModifierResult.hitCount,
            })
        }

        for (let hitIndex = 0; hitIndex < hitModifierResult.hitCount; hitIndex++) {
            if (!target.isAlive() || !context.actor.isAlive()) {
                break;
            }

            context.events.push({
                type: 'hit_resolved',
                hitIndex,
                resolution: { result: "hit", },
                source: { type: 'skill', skillId: skill.id },
            })

            const targetHpBefore = target.getCurrentHp();
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

            const result = this.consequences.resolve({
                context, target, skill, directDamage: hitResult.totalAppliedDamage,
                baseDamage: hitResult.totalBaseDamage, targetHpBefore,
                hit: { hitIndex, outcome: 'hit', critical: hitResult.critical, penetrating: false,
                    components: hitResult.components.map(component => ({ componentIndex: component.componentIndex,
                        damageType: component.damageType, appliedDamage: component.appliedDamage })) },
            });
            consequences.push(result);
            hitResults.push(result.playback);
            statusEffects.push(...result.statusEffects);
        }

        const { lifeStealResult, reflectedDmgResult } = this.consequences.summarize(consequences);

        if (skill.cd.onActivate) {
            const result = context.actor.startSkillCooldown(skill.id, skill.cd.onActivate)
            context.events.push({
                type: 'cooldown_updated',
                remainingTurns: result.remainingTurns,
                skillId: skill.id,
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
            hitResults,
            modifiers: {
                plannedHitCount: hitModifierResult.hitCount, executedHitCount: hits.length,
                damageMultiplierPerHit: hitModifierResult.dmgMultiplierPerHit,
                skillDamageMultiplier: dmgModifierResult.multiplier,
                buffDamageMultiplier, contextualDamageMultiplier: contextualBonusDmgMultiplier,
                damageModifierApplied: dmgModifierResult.applied, damageModifierType: dmgModifierResult.modifierType,
                damageModifierDescription: dmgModifierResult.description,
            },
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