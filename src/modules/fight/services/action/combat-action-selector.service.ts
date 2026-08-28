import { Injectable } from "@nestjs/common";
import { TurnContext } from "../../types/fight/fight-context.types";
import { SharedFightService } from "../shared-fight.service";
import { TargetSelectorService } from "./target-selector.service";
import { SkillDamageSelectorService } from "./skill-damage-selector.service";
import { CastAuraAction, CastBuffAction, CombatAction, UseHealingSkillAction } from "netim2-shared";
import { randomUUID } from "crypto";

@Injectable()
export class CombatActionSelectorService {
    constructor(
        private sharedFightService: SharedFightService,
        private targetSelectorService: TargetSelectorService,
        private skillDamageSelectorService: SkillDamageSelectorService,
    ) { }

    select(context: TurnContext, canAct: boolean): CombatAction {
        if (!context.actor.isAlive() || !canAct) {
            return {
                type: 'skip_turn',
                reason: 'no_available_action'
            }
        }
        const healingAction = this.selectAvailableHealingSkill(context)
        if (healingAction) {
            context.events.push({
                type: 'action_selected',
                action: {
                    type: 'use_healing_skill',
                    skillId: healingAction.skillId,
                    targetId: healingAction.targetId
                },
                actorId: context.actor.id,
                eventId: randomUUID(),
                fightId: context.fight.id,
                turnNumber: context.turnNumber
            })
            return healingAction
        }

        const auraAction = this.selectAvailableAura(context)
        if (auraAction) {
            context.events.push({
                type: 'action_selected',
                action: {
                    type: 'cast_aura',
                    skillId: auraAction.skillId,
                },
                actorId: context.actor.id,
                eventId: randomUUID(),
                fightId: context.fight.id,
                turnNumber: context.turnNumber
            })
            return auraAction
        }
        const buffAction = this.selectAvailableBuff(context)
        if (buffAction) {
            context.events.push({
                type: 'action_selected',
                action: {
                    type: 'cast_buff',
                    skillId: buffAction.skillId,
                    targetId: buffAction.targetId
                },
                actorId: context.actor.id,
                eventId: randomUUID(),
                fightId: context.fight.id,
                turnNumber: context.turnNumber
            })
            return buffAction
        }

        const targetId = this.targetSelectorService.selectTarget(context)

        if (context.actor.fightConfig.self.priorityBassicAttack) {
            context.events.push({
                type: 'action_selected',
                action: {
                    type: 'basic_attack',
                    targetId: targetId
                },
                actorId: context.actor.id,
                eventId: randomUUID(),
                fightId: context.fight.id,
                turnNumber: context.turnNumber
            })
            return {
                type: 'basic_attack',
                targetId
            }
        }

        const skillAction = this.skillDamageSelectorService.trySelectAvailableDamageSkill(context, targetId)
        if (skillAction) {
            context.events.push({
                type: 'action_selected',
                action: {
                    type: 'use_damage_skill',
                    skillId: skillAction.skillId,
                    targetId: skillAction.targetId
                },
                actorId: context.actor.id,
                eventId: randomUUID(),
                fightId: context.fight.id,
                turnNumber: context.turnNumber
            })
            return skillAction
        }

        context.events.push({
            type: 'action_selected',
            action: {
                type: 'basic_attack',
                targetId: targetId
            },
            actorId: context.actor.id,
            eventId: randomUUID(),
            fightId: context.fight.id,
            turnNumber: context.turnNumber
        })

        return {
            type: 'basic_attack',
            targetId
        }
    }

    private selectAvailableAura(ctx: TurnContext): CastAuraAction | undefined {
        const allAuras = ctx.actor.getSkillsAura()
        for (const aura of allAuras) {
            if (ctx.actor.hasActiveAuraBySkillId(aura.id)) continue
            if (!this.sharedFightService.canUseSkill(ctx.actor, aura)) continue
            return {
                type: 'cast_aura',
                skillId: aura.id
            }
        }
        return undefined
    }

    private selectAvailableBuff(ctx: TurnContext): CastBuffAction | undefined {
        const allBuffs = ctx.actor.getSkillsBuff()
        for (const buff of allBuffs) {
            if (ctx.actor.hasActiveBuffBySkillId(buff.id)) continue
            if (!this.sharedFightService.canUseSkill(ctx.actor, buff)) continue
            return {
                type: 'cast_buff',
                skillId: buff.id,
                targetId: ctx.actor.id
            }
        }
        return undefined
    }

    private selectAvailableHealingSkill(ctx: TurnContext): UseHealingSkillAction | undefined {
        if (ctx.actor.getHpPercentage() >= ctx.actor.fightConfig.self.HealingSkillHpThresholdPercent) {
            return undefined
        }
        const allHealingSkills = ctx.actor.getSkillsHeal()
        for (const skill of allHealingSkills) {
            if (!this.sharedFightService.canUseSkill(ctx.actor, skill)) continue
            return {
                skillId: skill.id,
                targetId: ctx.actor.id,
                type: 'use_healing_skill'
            }
        }
        return undefined
    }
}