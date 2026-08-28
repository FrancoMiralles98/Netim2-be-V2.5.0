import { Injectable } from "@nestjs/common";
import { SharedFightService } from "../shared-fight.service";
import { BuffActionResolution, ResolveActionInput } from "../../types/actionResolution/action-resolution.types";
import { BuffManager } from "../../manager/buff-manager";
import { ActiveBuffEffect, CastBuffAction, SkillBuff } from "netim2-shared";
import { randomUUID } from "crypto";

@Injectable()
export class BuffActionResolver {
    constructor(
        private sharedFightService: SharedFightService,
        private buffManager: BuffManager,
    ) { }

    resolve({ action, context }: ResolveActionInput<CastBuffAction>): BuffActionResolution {
        const skill = context.actor.getSkillById(action.skillId)
        if (!this.sharedFightService.canUseSkill(context.actor, skill)) {
            throw new Error('This actor cant use this skill.')
        }
        if (skill.type !== 'buff') {
            throw new Error('La skill tiene que ser una buff')
        }
        if (context.actor.hasActiveBuffBySkillId(skill.id)) {
            throw new Error('No puede usar un buffo que ya esta activado')
        }
        const manaSpent = context.actor.spendMana(this.sharedFightService.getInitialManaCost(skill))

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

        const buff = this.buffManager.activate({
            appliedOnTurn: context.turnNumber,
            effects: this.transformActiveEffect(skill),
            modifiers: skill.stats,
            skill,
            source: context.actor,
            target: context.actor
        })

        context.events.push({
            type: 'buff_applied',
            buffInstanceId: buff.getInstanceId(),
            eventId: randomUUID(),
            fightId: context.fight.id,
            skillId: buff.getSkillId(),
            sourceFighterId: context.actor.id,
            targetFighterId: action.targetId,
            turnNumber: context.turnNumber,
            remainingTurns: buff.getRemainingTurns()
        })


        if (skill.cd.onActivate) {
            const result = context.actor.startSkillCooldown(skill.id, skill.cd.onActivate)
            context.events.push({
                type: 'cooldown_updated',
                eventId: randomUUID(),
                fighterId: context.actor.id,
                fightId: context.fight.id,
                previousRemainingTurns: result.initialTurns,
                remainingTurns: result.remainingTurns,
                skillId: buff.getSkillId(),
                turnNumber: context.turnNumber
            })
        }

        context.actor.statistics.registerResources({ manaSpent: manaSpent.amount })

        return {
            actorId: context.actor.id,
            buffInstanceId: buff.getInstanceId(),
            manaSpent: manaSpent.amount,
            cooldownRemainingTurns: context.actor.getSkillRemainingCooldown(buff.getSkillId()),
            remainingMana: manaSpent.manaAfter,
            skillId: buff.getSkillId(),
            success: true,
            targetId: context.actor.id,
            type: 'cast_buff',
            remainingDuration: buff.getRemainingTurns(),
            remainingUses: buff.getTotalRemainingUses()
        }
    }

    private transformActiveEffect(skill: SkillBuff): ActiveBuffEffect[] {
        return skill.effects.map(buff => ({
            allowedSkillIds: [...buff.allowedSkillIds],
            consumeOn: buff.consumeOn,
            multiplier: buff.multiplier,
            remainingUses: buff.uses,
            type: buff.type
        }))
    }
}