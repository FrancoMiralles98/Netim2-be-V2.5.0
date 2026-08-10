import { Injectable } from "@nestjs/common";
import { HealingSkillActionResolution, ResolveActionInput } from "../../types/actionResolution/action-resolution.types";
import { UseHealingSkillAction } from "../../types/combatAction/combat-action.types";
import { SharedFightService } from "../shared-fight.service";
import { SkillHeal } from "netim2-shared";
import { FighterCombatEntity } from "../../entities/fighter-combat.entity";
import { RngService } from "src/modules/shared/services/rng.service";
import { HealingResolverService } from "./healing-resolver.service";

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

        const opponent = context.fight.getSingleOpponentOf(context.actor.id)

        const healingResult = this.healingResolver.resolve({
            baseAmount: heal,
            healer: context.actor,
            source: 'skill'
        })
        if (skill.cd.onActivate) {
            context.actor.startSkillCooldown(skill.id, skill.cd.onActivate)
        }
        context.actor.statistics.registerHealing({
            type: 'skill',
            amount: healingResult.effectiveHealing,
            idSkill: skill.id
        })

        opponent.statistics.registerHealing({
           type: 'prevented',
           amount: healingResult.preventedAmount
        })

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
}