import { Injectable } from "@nestjs/common";
import { HealingSkillActionResolution, ResolveActionInput } from "../../types/actionResolution/action-resolution.types";
import { UseHealingSkillAction } from "../../types/combatAction/combat-action.types";
import { SharedFightService } from "../shared-fight.service";
import { SkillHeal, UNIQUE_ID_SKILLS } from "netim2-shared";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";
import { RngService } from "src/modules/shared/services/rng.service";
import { HealingResolverService } from "./healing-resolver.service";
import { FightEntity } from "../../entities/fight.entity";
import { HealingResolution } from "./healing-resolver.types";

@Injectable()
export class HealingSkillActionResolverService {
    constructor(
        private sharedFightService: SharedFightService,
        private rngService: RngService,
        private healingResolver: HealingResolverService
    ) { }

    resolve(
        { action, context }: ResolveActionInput<UseHealingSkillAction>
    ): HealingSkillActionResolution {
        const skill = context.actor.getSkillById(action.skillId)
        if (skill.type !== 'heal') {
            throw new Error('la skill tiene que ser una curacion')
        }
        if (!this.sharedFightService.canUseSkill(context.actor, skill)) {
            throw new Error('No puede usar esta habilidad')
        }

        const manaSpent = context.actor.spendMana(this.sharedFightService.getInitialManaCost(skill))
        const { critical, heal } = this.calculateHealing(skill, context.actor)


        const healingResult = this.healingResolver.resolve({
            baseAmount: heal,
            healer: context.actor,
            source: 'skill'
        })

        if (skill.cd.onActivate) {
            context.actor.startSkillCooldown(skill.id, skill.cd.onActivate)
        }

        this.healingSkillActionStatisticRegister(
            context.actor,
            context.fight,
            healingResult,
            skill.id,
            manaSpent.amount
        )

        return {
            actorId: context.actor.id,
            appliedHealing: healingResult.effectiveHealing,
            preventedHealing: healingResult.preventedAmount,
            critical,
            manaSpent: manaSpent.amount,
            remainingMana: manaSpent.manaAfter,
            skillId: skill.id,
            success: true,
            targetId: context.actor.id,
            type: 'use_healing_skill',
            hpAfter: healingResult.hpAfter,
            hpBefore: healingResult.hpBefore,
            cooldownRemainingTurns: context.actor.getSkillRemainingCooldown(skill.id)
        }
    }

    private calculateHealing(
        skill: SkillHeal,
        actor: FighterCombatEntity
    ): { heal: number, critical: boolean } {
        let totalHealing = 0
        skill.components.forEach(comp => {
            totalHealing += this.rngService.randomNumberInRange(comp.range.min, comp.range.max)
        })

        const isCritic = this.rngService.rollChance(actor.effectiveStats.bonus.daño.critico)

        if (isCritic) {
            totalHealing *= 1 + actor.effectiveStats.bonus.daño.daño_critico / 100
        }

        return { heal: Math.floor(totalHealing), critical: isCritic }
    }

    private healingSkillActionStatisticRegister(
        actor: FighterCombatEntity,
        fight: FightEntity,
        healingResult: HealingResolution,
        idSkill: UNIQUE_ID_SKILLS,
        manaSpent: number,
    ): void {

        actor.statistics.registerHealing({
            type: 'skill',
            amount: healingResult.effectiveHealing,
            idSkill,
        })

        actor.statistics.registerResources({
            manaSpent
        })

        actor.statistics.registerSkillUsed()

        healingResult.reductions.forEach(reductionDetail => {
            const fighter = fight.getFighter(reductionDetail.sourceFighterId)
            fighter.statistics.registerHealing({
                type: 'prevented',
                amount: reductionDetail.preventedAmount
            })
        })
    }
}